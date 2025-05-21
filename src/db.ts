import Dexie from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
  city?: string;
}

export class MyDatabase extends Dexie {
  friends!: Dexie.Table<Friend, number>; // Definite assignment assertion

  constructor() {
    super('MyBlogDemoDatabase');
    this.version(1).stores({
      friends: "++id,name,age"
    });
    this.version(2).stores({
      friends: "++id,name,age,city"
    });
  }
}

export const db = new MyDatabase();

// CRUD: Add
export async function addFriend(friend: Omit<Friend, 'id'>) {
  return await db.friends.add(friend);
}

// CRUD: Read (Get by ID)
export async function getFriend(id: number) {
  return await db.friends.get(id);
}

// CRUD: Update
export async function updateFriend(id: number, changes: Partial<Friend>) {
  return await db.friends.update(id, changes);
}

// CRUD: Delete
export async function deleteFriend(id: number) {
  return await db.friends.delete(id);
}

// Query: Friends older than 20
export async function getFriendsOlderThan20() {
  return await db.friends.where("age").above(20).toArray();
}

// Query: Friends by name "John Doe"
export async function getJohnDoes() {
  return await db.friends.where("name").equals("John Doe").toArray();
}

// Query: "John Doe"s over 20
export async function getJohnDoesOver20() {
  return await db.friends.where("age").above(20).and(friend => friend.name === "John Doe").toArray();
}

// Transaction Example
export async function performTransaction() {
  await db.transaction('rw', db.friends, async () => {
    await db.friends.add({ name: "Alice", age: 25, city: "New York" });
    await db.friends.add({ name: "Bob", age: 22, city: "London" });
  });
}
