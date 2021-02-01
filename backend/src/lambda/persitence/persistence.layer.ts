
import { docClient, TodosTable, TodosBucket } from '../../config'
import { TodoItem } from '../../models/TodoItem'
import { GenerateURLRequest } from '../../requests/GenerateURLRequest'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
const logger = createLogger('CreateTodo')

export const createTotoPersistence = async (newTodoPersistable: TodoItem) => {

  logger.info('Creating Todo ', newTodoPersistable)
    await docClient.put({
        TableName: TodosTable,
        Item: newTodoPersistable,
    }).promise()

    delete newTodoPersistable.userId

    return newTodoPersistable;
}

export const updateTodo = async (userId: string, todoId: string, updatedTodo: UpdateTodoRequest) => {

  logger.info('Updating Todo ', updatedTodo)

  const persitedTodo = await docClient.update({
    TableName: TodosTable,
    Key: {
      userId,
      todoId,
    },
    UpdateExpression: "set #na = :n, done=:do",
    ConditionExpression: "todoId = :to",
    ExpressionAttributeValues: {
      ":n": updatedTodo.name,
      ":do": updatedTodo.done,
      ":to": todoId,
    },
    ExpressionAttributeNames: {
      "#na": "name"
    },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  return persitedTodo;
}

export const updateAttachmentURLTodo = async (userId: string, todoId: string, updatedTodo: GenerateURLRequest) => {

  logger.info('Updating attachmentURL Todo ', updatedTodo)

  const persitedTodo = await docClient.update({
    TableName: TodosTable,
    Key: {
      userId,
      todoId,
    },
    UpdateExpression: "set attachmentUrl = :url",
    ExpressionAttributeValues: {
      ":url": `https://${TodosBucket}.s3.amazonaws.com/${updatedTodo.fileName}`,
    },
    ReturnValues: "UPDATED_NEW"
  }).promise()

  return persitedTodo;
}

export const getTodos = async (userId: string) => {

  logger.info('Getting Todos for user ', userId)

  const todos = await docClient.query({
    TableName: TodosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    }
  }).promise();

  return todos;
}

export const deleteTodo = async (todoId: string, userId: string) => {

  logger.info('Deleting Todo ', todoId)

  const todo = await docClient.delete({
    TableName: TodosTable,
    Key:{
        todoId,
        userId,
    },
}).promise();

  return todo;
}

