const fs = require('fs');
const path = require('path');
const dataFilePath = path.join(__dirname,'..','..','users.json');


// const readTasks = () => {
//     try{
//         const data = fs.readFileSync(dataFilePath, 'utf8');
//         return JSON.parse(data);
//     }catch(err){
//       logger.info('The file is empty')
//       return [];
//     }
// }
  

const saveTasks = (tasks) => {
    const data = JSON.stringify(tasks);
        fs.writeFile(dataFilePath, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Tasks saved successfully');
        }
    });
};

module.exports = {
    // readTasks,
    saveTasks,
}