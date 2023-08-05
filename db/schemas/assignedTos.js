import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { todos } from './todos.js';
import { users } from './users.js';


export const assignedTos = pgTable('assignedTos', {
    id: serial('id').primaryKey(),
    todoId: integer('todoId').notNull().references(() => todos.id),
    userId: integer('userId').notNull().references(() => users.id),
});

export const assignedsToRelations = relations(assignedTos, ({ one }) => ({
    todo: one(todos, {
        fields: [assignedTos.todoId],
        references: [todos.id],
    }),
    user: one(users, {
        fields: [assignedTos.userId],
        references: [users.id],
    }),
}));
