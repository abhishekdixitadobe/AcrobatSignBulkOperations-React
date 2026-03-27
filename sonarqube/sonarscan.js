const scanner = require("sonarqube-scanner");

scanner(
    {
        serverUrl: "http://localhost:9000",
        token: "sqp_f42312755ce9f5001e33d67cef10c43e1af925fc",
        options: {
            "sonar.projectName": "AcrobatSignBulkOperationsTool",
            "sonar.projectDescription": "Bulk Opearations Tool",
            "sonar.projectKey": "AcrobatSignBulkOperationsTool",
            "sonar.projectVersion": "0.0.1",
            "sonar.sourceEncoding": "UTF-8",
            "sonar.javascript.lcov.reportPaths": "coverage/lcov.info"
        }
    },
    ()=> process.exit()
);