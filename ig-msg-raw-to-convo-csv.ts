import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { TextDecoder } from 'util';

/**
 * Converts raw Instagram message files to a CSV format
 * 
 * @returns {Promise<void>} A promise that resolves when the CSV conversion is complete
 */
export const convert_ig_msg_raw_to_convo_csv = async (): Promise<void> => {
    // Read all files in the raw messages directory
    const raw_message_files = await readdir('./ig-msg-raw');
    
    // Create a text decoder for Latin1 encoding
    const latin1_decoder = new TextDecoder('latin1');

    // Initialize CSV with header row
    let csv_rows = [['convo', 'timestamp', 'sender', 'message'].join(',')];

    // Iterate through each raw message file
    for (const file_name of raw_message_files) {
        // Read the file as a Buffer
        const file_buffer = await readFile(join('./ig-msg-raw', file_name));
        
        // Decode the file content using Latin1 encoding
        const file_content = latin1_decoder.decode(file_buffer);
        
        // Parse the JSON content of the file
        const message_data = JSON.parse(file_content);

        // Extract conversation ID from filename
        const conversation_id = (file_name.startsWith('instagramuser_') ? file_name.split('_')[1] : '');

        // Sort messages by timestamp to ensure chronological order
        message_data.messages.sort((a: any, b: any) => a.timestamp_ms - b.timestamp_ms);

        // Skip group chats (only process 1-on-1 conversations)
        if (message_data.participants.length !== 2) continue;

        // Process each message in the conversation
        for (const message of message_data.messages) {
            // Skip irrelevant or empty messages
            if (
                !message.content ||
                (message.content.includes('to your message') && message.content.includes('Reacted')) ||
                message.content.includes('sent an attachment.') ||
                message.content.includes(' shared a story.') ||
                message.content == 'Liked a message'
            ) continue;

            // Extract message details
            const sender_name = message.sender_name;
            const conversation_name = message_data.participants[0].name;
            const message_content = message.content;

            /**
             * Sanitizes a field for CSV output by escaping quotes and removing line breaks
             * 
             * @param {string} field - The field to sanitize
             * @returns {string} The sanitized field enclosed in quotes
             */
            const sanitize_csv_field = (field: string): string =>
                `"${field
                    .replace(/"/g, '""')
                    .replace(/\r?\n|\r/g, ' ')
                    .trim()}"`;

            // Add sanitized message to CSV rows
            csv_rows.push(
                [
                    conversation_id || sanitize_csv_field(conversation_name),
                    message.timestamp_ms,
                    sanitize_csv_field(sender_name),
                    sanitize_csv_field(message_content),
                ].join(',')
            );
        }
    }

    // Write the CSV content to a file using Latin1 encoding
    await writeFile('./convo.csv', csv_rows.join('\n'), { encoding: 'latin1' });
};

// Immediately invoke the conversion function
convert_ig_msg_raw_to_convo_csv();
