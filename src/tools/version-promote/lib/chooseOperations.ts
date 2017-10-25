import * as inquirer from "inquirer";

export default () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "Which operation do you want?",
            choices: [
                {
                    name: "New Version",
                    value: "new"
                },
                {
                    name: "Promote Version",
                    value: "promote"
                }
            ]
        }
    ]);
};