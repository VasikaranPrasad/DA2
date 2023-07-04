const fs = require('fs');
const { Client } = require('ssh2');

const config = {
  host: 'sjrrntlserver',
  port: 22,
  username: 'vasikaran',
  password: 'Vasikaran@123',
};

const userDirectory = 'reva';
const directoryPath = `/projects/data/sigmasense/sdc300/users/${userDirectory}/genus/drc_max_m40-09-05-23`;

const stages = ['elab', 'generic', 'mapped', 'opt', 'opt_inc'];

const extractData = (fileContent) => {
  const data = {};

  stages.forEach((stage) => {
    const regex = new RegExp(`set STAGE ${stage}(.+?)\\[.*?\\]`, 'gs');
    const matches = fileContent.match(regex);

    const stageData = matches
      ? matches.map((match) => {
          [, timestamp] = match.match(/set STAGE .+ (.+)/);
          return {
            timestamp: timestamp.trim(),
            type: 'STAGE',
            message: stage,
          };
        })
      : [];

    data[stage] = stageData;
  });

  return data;
};

const connectAndExtractData = () => {
  const conn = new Client();

  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) {
        console.error('Error while creating SFTP session:', err);
        conn.end();
        return;
      }

      sftp.readFile(`${directoryPath}/genus.log3`, 'utf8', (err, data) => {
        if (err) {
          console.error('Error while reading file:', err);
          conn.end();
          return;
        }

        const fileContent = data.toString();
        const extractedData = extractData(fileContent);

        // Convert extractedData to JSON string
        const jsonData = JSON.stringify(extractedData, null, 2);

        // Specify the output file path in the main server
        const serverOutputPath = `${directoryPath}/output.json`;

        // Write the JSON string to the output file in the main server
        sftp.writeFile(serverOutputPath, jsonData, 'utf8', (err) => {
          if (err) {
            console.error('Error while writing to server output file:', err);
            conn.end();
            return;
          }

          console.log(`Data extracted and saved to ${serverOutputPath} in the main server successfully.`);

          // Specify the output file path in the local VS Code server
          const localOutputPath = `${__dirname}/output.json`;

          // Write the JSON string to the output file in the local VS Code server
          fs.writeFile(localOutputPath, jsonData, 'utf8', (err) => {
            if (err) {
              console.error('Error while writing to local output file:', err);
              conn.end();
              return;
            }

            console.log(`Data extracted and saved to ${localOutputPath} in the local VS Code server successfully.`);
            conn.end();
          });
        });
      });
    });
  });

  conn.connect(config);
};

connectAndExtractData();















// basic data coolectin

// const fs = require('fs');
// const { Client } = require('ssh2');

// const config = {
//   host: 'sjrrntlserver',
//   port: 22,
//   username: 'vasikaran',
//   password: 'Vasikaran@123',
// };

// // User-specific directory name
// const userDirectory = 'subash';


// // Construct the file path with the dynamic user directory
// const filePath = `/projects/data/sigmasense/sdc300/users/${userDirectory}/RUNS/Merge/genus.log`;

// const stages = ['elab', 'generic', 'mapped', 'opt', 'opt_inc'];

// const extractData = (fileContent) => {
//   const data = {};

//   stages.forEach((stage) => {
//     const regex = new RegExp(`set STAGE ${stage}(.+?)\\[.*?\\]`, 'gs');
//     const matches = fileContent.match(regex);

//     const stageData = matches
//       ? matches.map((match) => {
//           const [, timestamp] = match.match(/set STAGE .+ (.+)/);
//           return {
//             timestamp: timestamp.trim(),
//             type: 'STAGE',
//             message: stage,
//           };
//         })
//       : [];

//     data[stage] = stageData;
//   });

//   return data;
// };

// const connectAndExtractData = () => {
//   const conn = new Client();

//   conn.on('ready', () => {
//     conn.sftp((err, sftp) => {
//       if (err) {
//         console.error('Error while creating SFTP session:', err);
//         conn.end();
//         return;
//       }

//       sftp.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//           console.error('Error while reading file:', err);
//         } else {
//           const fileContent = data.toString();
//           const extractedData = extractData(fileContent);

//           // Convert extractedData to JSON string
//           const jsonData = JSON.stringify(extractedData, null, 2);

//           // Specify the absolute path for output.json file
//           const outputPath = 'output.json';

//           // Write the JSON string to the output.json file
//           fs.writeFile(outputPath, jsonData, 'utf8', (err) => {
//             if (err) {
//               console.error('Error while writing to output.json:', err);
//             } else {
//               console.log('Data extracted and saved to output.json successfully.');
//             }
//           });
//         }

//         conn.end();
//       });
//     });
//   });

//   conn.connect(config);
// };

// connectAndExtractData();












// Raading all the files from the directory

// const fs = require('fs');
// const { Client } = require('ssh2');

// const config = {
//   host: 'sjrrntlserver',
//   port: 22,
//   username: 'vasikaran',
//   password: 'Vasikaran@123',
// };

// // User-specific directory name
// const userDirectory = 'subash';

// // Construct the base directory path
// const baseDirectory = `/projects/data/sigmasense/sdc300/users/${userDirectory}`;

// // Function to recursively traverse a directory and collect file/directory details
// const traverseDirectory = (directoryPath, callback) => {
//   fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
//     if (err) {
//       console.error('Error while reading directory:', err);
//       return;
//     }

//     const items = [];

//     files.forEach((file) => {
//       const item = {
//         name: file.name,
//         isDirectory: file.isDirectory(),
//         path: `${directoryPath}/${file.name}`
//       };

//       items.push(item);

//       if (file.isDirectory()) {
//         // Recursively traverse subdirectories
//         traverseDirectory(item.path, callback);
//       }
//     });

//     callback(items);
//   });
// };

// // Function to extract data from a file
// const extractDataFromFile = (filePath, callback) => {
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error while reading file:', err);
//       callback(null);
//     } else {
//       const fileContent = data.toString();
//       const extractedData = extractData(fileContent);
//       callback(extractedData);
//     }
//   });
// };

// // Function to extract data from the file content
// const extractData = (fileContent) => {
//   const data = {};

//   // Perform data extraction logic here

//   return data;
// };

// // Connect to the SSH server, traverse directory, and extract data
// const connectAndExtractData = () => {
//   const conn = new Client();

//   conn.on('ready', () => {
//     traverseDirectory(baseDirectory, (items) => {
//       items.forEach((item) => {
//         if (!item.isDirectory) {
//           extractDataFromFile(item.path, (extractedData) => {
//             if (extractedData) {
//               // Convert extractedData to JSON string
//               const jsonData = JSON.stringify(extractedData, null, 2);

//               // Specify the output path for each file
//               const outputPath = `${item.path}.json`;

//               // Write the JSON string to the output file
//               fs.writeFile(outputPath, jsonData, 'utf8', (err) => {
//                 if (err) {
//                   console.error('Error while writing to output file:', err);
//                 } else {
//                   console.log(`Data extracted and saved to ${outputPath} successfully.`);
//                 }
//               });
//             }
//           });
//         }
//       });

//       conn.end();
//     });
//   });

//   conn.connect(config);
// };

// connectAndExtractData();