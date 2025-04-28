import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Represents a single message in a conversation
 */
interface message {
    /** The role of the message sender */
    role: 'user' | 'assistant';
    /** The content of the message */
    content: string;
}

/**
 * Represents a complete conversation containing multiple messages
 */
interface conversation {
    /** Array of messages in the conversation */
    conversations: message[];
}

/** Path to the input CSV file */
const input_file = 'convo.csv';

/** Path to the output JSON file */
const output_file = 'convo.json';

/** Name of the assistant in the conversations */
const assistant_name = 'gabe chantayan 🇦🇲🧿';

/** Maximum time gap between messages to consider as a single conversation (24 hours) */
const max_conversation_gap_ms = 24 * 60 * 60 * 1000;

/** Maximum time gap between back-to-back messages from the same sender (60 minutes) */
const max_message_merge_gap_ms = 60 * 60 * 1000;

/**
 * Converts a CSV file of messages into structured JSON conversations
 * 
 * @returns {void}
 */
async function convert_conversations(): Promise<void> {
    try {
        // Read the input CSV file 
        const input_content = await fs.promises.readFile(path.resolve(__dirname, input_file), 'utf-8');

        // Parse CSV into records 
        const records = parse(input_content, {
            columns: ['convo', 'timestamp', 'sender', 'message'],
            skip_empty_lines: true,
        });

        // Initialize conversation storage
        const conversations: conversation[] = [];
        let current_conversation: message[] = [];
        let last_timestamp = 0;
        let last_sender_column = '';
        let last_sender = '';
        let last_role: 'user' | 'assistant' | null = null;

        // Iterate through each record to build conversations
        for (const record of records) {
            const { sender_column, timestamp, sender, message } = record;
            const timestamp_num = Number(timestamp);

            // Determine the role of the message sender
            const role: 'user' | 'assistant' = sender === assistant_name ? 'assistant' : 'user';

            // Check if the message can be merged with the previous message
            const time_gap = timestamp_num - last_timestamp;
            const sender_changed = sender_column !== last_sender_column;
            const role_changed = role !== last_role;
            const can_merge_message = 
                !sender_changed && 
                !role_changed && 
                time_gap <= max_message_merge_gap_ms;

            // Determine if a new conversation should be started
            const should_split = 
                sender_changed || 
                time_gap > max_conversation_gap_ms;

            // Save previous conversation if splitting is needed
            if (should_split && current_conversation.length > 0) {
                // Only add conversation if it has both user and assistant messages
                const has_user_message = current_conversation.some(msg => msg.role === 'user');
                const has_assistant_message = current_conversation.some(msg => msg.role === 'assistant');
                
                if (has_user_message && has_assistant_message) {
                    conversations.push({ conversations: current_conversation });
                }
                
                current_conversation = [];
            }

            // Add or merge message to current conversation
            if (can_merge_message && current_conversation.length > 0) {
                // Merge messages from the same sender within 60 minutes
                const last_message = current_conversation[current_conversation.length - 1];
                last_message.content += `\n${message}`;
            } else {
                // Add new message to conversation
                current_conversation.push({
                    role,
                    content: message,
                });
            }

            // Update tracking variables
            last_timestamp = timestamp_num;
            last_sender_column = sender_column;
            last_sender = sender;
            last_role = role;
        }

        // Add the last conversation if it exists and meets the criteria
        if (current_conversation.length > 0) {
            const has_user_message = current_conversation.some(msg => msg.role === 'user');
            const has_assistant_message = current_conversation.some(msg => msg.role === 'assistant');
            
            if (has_user_message && has_assistant_message) {
                conversations.push({ conversations: current_conversation });
            }
        }

        // Write conversations to output JSON file
        await fs.promises.writeFile(
            path.resolve(__dirname, output_file), 
            JSON.stringify(conversations, null, 2), 
            'utf-8'
        );

        // Log conversion summary
        console.log(`Done! Converted ${records.length} messages into ${conversations.length} conversations.`);
    } catch (error) {
        // Log any errors that occur during conversion
        console.error('Error converting conversations:', error);
        process.exit(1);
    }
}

// Execute the conversation conversion
convert_conversations();
