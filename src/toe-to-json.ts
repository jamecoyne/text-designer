import * as fs from 'fs';
import * as path from 'path';
import { rawToColor, rawToString } from './parsers';
import { jsonStructure, jsonValue } from './types';

// Define an interface to represent the file structure and the structure of file content
interface FileStructure {
    [key: string]: FileStructure | jsonStructure;
}

// Function to get the file system structure
function getDirectoryStructure(dirPath: string): FileStructure {
    const structure: FileStructure = {};

    // Read all the files and directories in the given path
    const files = fs.readdirSync(dirPath);

    files.forEach((file: string) => {
        // Ignore .DS_Store files or any other files you want to skip
        if (file === '.DS_Store') return;

        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // If it's a directory, recursively get its structure
            structure[file] = getDirectoryStructure(fullPath);
        } else {
            // If it's a file, read the contents and create a key-value object
            structure[file] = processFile(fullPath);
        }
    });

    return structure;
}

// Function to process a file and convert each line into a key-value pair
function processFile(filePath: string): jsonStructure {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const fileContentObj: jsonStructure = {};

    lines.forEach((line: string) => {
        const [key, ...rest] = line.trim().split(' ');
        if (key && key != "end") {
            fileContentObj[key] = processValue(key, rest)
        }
    });

    return fileContentObj;
}

function processValue(key: string, value: string[]): jsonValue {
    if(value.length === 0){
        return null;
    }
    if(key === "color"){
        return rawToColor(value);
    }
    if(key === "comment"){
        return rawToString(value)
    }
    return value;
}

// Function to write the structure to a JSON file
function writeStructureToFile(directoryPath: string, outputFilePath: string): void {
    const structure = getDirectoryStructure(directoryPath);
    fs.writeFileSync(outputFilePath, JSON.stringify(structure, null, 2), 'utf-8');
    console.log(`File structure has been written to ${outputFilePath}`);
}

// Example usage
const inputDir = '../data/expanded/NewProject.toe.dir';  // Specify the directory you want to scan
const outputFile = '../data/json-output/output.json';  // Output JSON file

writeStructureToFile(inputDir, outputFile);
