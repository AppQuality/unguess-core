import Table from "./table";

type ServiceTemplatesParams = {
  id?: number;
  name?: string;
  config?: string;
};
const defaultItem: ServiceTemplatesParams = {
  id: 1,
  name: "???",
  config: "{}",
};
class ServiceTemplates extends Table<ServiceTemplatesParams> {
  protected name = "service_templates";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "name VARCHAR(255)",
    "config TEXT",
  ];
  constructor() {
    super(defaultItem);
  }
}
const serviceTemplates = new ServiceTemplates();
export default serviceTemplates;
export type { ServiceTemplatesParams };
