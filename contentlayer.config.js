import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    name: {
      type: "string",
      description: "The title of the project",
      required: true,
    },
    dateUpdated: {
      type: "date",
      description: "The last time this project's page was updated",
      required: true,
    },
    description: {
      type: "string",
      description: "A short caption for the project",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (projects) => `/projects/${projects._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "projects",
  documentTypes: [Project],
});
