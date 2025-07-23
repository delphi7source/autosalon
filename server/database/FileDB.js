import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class FileDB {
  constructor(dbPath = './server/database/data') {
    this.dbPath = dbPath;
    this.collections = new Map();
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dbPath, { recursive: true });
    } catch (error) {
      console.error('Error creating database directory:', error);
    }
  }

  getCollectionPath(collectionName) {
    return path.join(this.dbPath, `${collectionName}.json`);
  }

  async loadCollection(collectionName) {
    try {
      const filePath = this.getCollectionPath(collectionName);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveCollection(collectionName, data) {
    const filePath = this.getCollectionPath(collectionName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  collection(name) {
    return new Collection(this, name);
  }
}

class Collection {
  constructor(db, name) {
    this.db = db;
    this.name = name;
  }

  async find(query = {}) {
    const data = await this.db.loadCollection(this.name);
    return this.filterData(data, query);
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id) {
    return await this.findOne({ _id: id });
  }

  async insertOne(document) {
    const data = await this.db.loadCollection(this.name);
    const newDoc = {
      _id: uuidv4(),
      ...document,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newDoc);
    await this.db.saveCollection(this.name, data);
    return newDoc;
  }

  async insertMany(documents) {
    const data = await this.db.loadCollection(this.name);
    const newDocs = documents.map(doc => ({
      _id: uuidv4(),
      ...doc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    data.push(...newDocs);
    await this.db.saveCollection(this.name, data);
    return newDocs;
  }

  async updateOne(query, update) {
    const data = await this.db.loadCollection(this.name);
    const index = data.findIndex(item => this.matchesQuery(item, query));
    
    if (index === -1) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const updateData = update.$set || update;
    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.db.saveCollection(this.name, data);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateById(id, update) {
    return await this.updateOne({ _id: id }, update);
  }

  async deleteOne(query) {
    const data = await this.db.loadCollection(this.name);
    const index = data.findIndex(item => this.matchesQuery(item, query));
    
    if (index === -1) {
      return { deletedCount: 0 };
    }

    data.splice(index, 1);
    await this.db.saveCollection(this.name, data);
    return { deletedCount: 1 };
  }

  async deleteById(id) {
    return await this.deleteOne({ _id: id });
  }

  async deleteMany(query) {
    const data = await this.db.loadCollection(this.name);
    const initialLength = data.length;
    const filteredData = data.filter(item => !this.matchesQuery(item, query));
    
    await this.db.saveCollection(this.name, filteredData);
    return { deletedCount: initialLength - filteredData.length };
  }

  async countDocuments(query = {}) {
    const data = await this.find(query);
    return data.length;
  }

  async aggregate(pipeline) {
    let data = await this.db.loadCollection(this.name);
    
    for (const stage of pipeline) {
      if (stage.$match) {
        data = this.filterData(data, stage.$match);
      }
      if (stage.$sort) {
        data = this.sortData(data, stage.$sort);
      }
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
      if (stage.$skip) {
        data = data.slice(stage.$skip);
      }
      if (stage.$group) {
        data = this.groupData(data, stage.$group);
      }
    }
    
    return data;
  }

  filterData(data, query) {
    if (Object.keys(query).length === 0) return data;
    return data.filter(item => this.matchesQuery(item, query));
  }

  matchesQuery(item, query) {
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'object' && value !== null) {
        if (value.$regex) {
          const regex = new RegExp(value.$regex, value.$options || '');
          if (!regex.test(item[key])) return false;
        } else if (value.$in) {
          if (!value.$in.includes(item[key])) return false;
        } else if (value.$gte !== undefined) {
          if (item[key] < value.$gte) return false;
        } else if (value.$lte !== undefined) {
          if (item[key] > value.$lte) return false;
        } else if (value.$gt !== undefined) {
          if (item[key] <= value.$gt) return false;
        } else if (value.$lt !== undefined) {
          if (item[key] >= value.$lt) return false;
        } else if (value.$ne !== undefined) {
          if (item[key] === value.$ne) return false;
        }
      } else {
        if (item[key] !== value) return false;
      }
    }
    return true;
  }

  sortData(data, sortObj) {
    return data.sort((a, b) => {
      for (const [key, direction] of Object.entries(sortObj)) {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return direction === 1 ? -1 : 1;
        if (aVal > bVal) return direction === 1 ? 1 : -1;
      }
      return 0;
    });
  }

  groupData(data, groupStage) {
    const groups = {};
    const groupBy = groupStage._id;
    
    for (const item of data) {
      const key = typeof groupBy === 'string' ? item[groupBy.slice(1)] : 'all';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    }
    
    return Object.entries(groups).map(([key, items]) => ({
      _id: key,
      count: items.length,
      items
    }));
  }
}

export default FileDB;