import Agreements from "./images/agreements.png"
import Workflows from "./images/workflows.jpg"
import Templates from "./images/Templates.jpg"
import Webforms from "./images/webforms.jpg"

const useCaseData = [
  {
    id: 1,
    name: "Agreements",
    description:
     "Download, Cancel agreements, reminders for Single/Multi user in bulk.Filter agreements based on specific date ranges, agreement status, and user groups allowing for targeted retrieval of desired records",
    cardImageUrl: Agreements,
    configs: {
      page: "/upload",
      formComponentId: "agreements",
      api: "/api/agreements",
    },
    isDisabled: process.env.DISABLE_AGREEMENTS === "true",
  },
 /* {
    id: 2,
    name: "Workflows​",
    description:
      "Effortlessly fetch agreements associated with workflows directly from the application, ensuring easy access to relevant records.",
    cardImageUrl: Workflows,
    configs: {
      page: "/upload",
      formComponentId: "workflows",
      api: "/api/workflows",
    },
    isDisabled: process.env.DISABLE_WORKFLOWS === "true",
  },*/
  {
    id: 3,
    name: "Templates",
    description:
      "With this capability, users can retrieve and download library templates and their associated form fields directly from within the bulk operations tool. Users can also hide the library templates in bulk.",
    cardImageUrl: Templates,
    configs: {
      page: "/upload",
      formComponentId: "templates",
      api: "/api/templates",
    },
    isDisabled: process.env.DISABLE_TEMPLATES === "true",
  },
  {
    id: 4,
    name: "Web Forms​",
    description:
      "Users can now access a list of created webforms and subsequently retrieve associated agreements to perform bulk operations (download agreements/form fields etc.).​",
    cardImageUrl: Webforms,
    configs: {
      page: "/upload",
      formComponentId: "webforms",
      api: "/api/webforms",
    },
    isDisabled: process.env.DISABLE_WEBFORMS === "true",
  }
];

export default useCaseData;
