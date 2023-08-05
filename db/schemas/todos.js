import { pgTable, serial, text, boolean, date, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { assignedTos } from './assignedTos.js';
import { todoNotes } from './todoNotes.js';


export const todos = pgTable('todos', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    desc: varchar('desc', { length: 256 }),
    createdAt: date('createdAt').defaultNow().notNull(),
    done: boolean('done').default(false),
});

export const todosRelations = relations(todos, ({ many }) => ({
    assigned: many(assignedTos),
    notes: many(todoNotes),
}));
