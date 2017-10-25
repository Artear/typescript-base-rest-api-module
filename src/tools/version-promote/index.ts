import chooseOperations from "./lib/chooseOperations";
import newOperation from "./lib/newOperation";
import clone from "./lib/cloneOperation";
import getVersionList from "./lib/versionList";

const NEW_OPERATION = "new";

chooseOperations()
    .then((op: any) => {
        if (op.operation === NEW_OPERATION) {
            newOperation();
        } else {
            getVersionList()
                .then((versions: Array<string>) => {
                    clone(versions, "", "");
                })
                .catch((err) => {
                    console.log(`Error gathering versions: ${err.message}`);
                });
        }
    })
    .catch((err) => {
        console.log(err.message);
    });