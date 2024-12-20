import * as admin from "firebase-admin";
const db = admin.firestore();

/**
 * Finds user by ID
 * @param {string} userId - user´s id
 */
const findUserById = (userId: string = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc =  db.collection('users').doc(userId)
      const item = await doc.get()
      const response = item.data()
      resolve(response)
    } catch (error) {
      reject(error)
    }
  })
}

export { findUserById }
