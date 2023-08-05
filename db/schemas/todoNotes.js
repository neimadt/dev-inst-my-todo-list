import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { todos } from './todos.js';


export const todoNotes = pgTable('todoNotes', {
    id: serial('id').primaryKey(),
    todoId: integer('todoId').notNull().references(() => todos.id),
    value: text('value').notNull(),
});

export const todoNotesRelations = relations(todoNotes, ({ one }) => ({
    todo: one(todos, {
        fields: [todoNotes.todoId],
        references: [todos.id],
    })
}));