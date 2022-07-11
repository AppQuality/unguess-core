import Table from "./table";

type ServicesParams = {
  id?: number;
  name?: string;
  template_id?: number;
};
const defaultItem: ServicesParams = {
  id: 1,
  name: "???",
  template_id: 0,
};
class Services extends Table<ServicesParams> {
  protected name = "services";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "name VARCHAR(255)",
    "template_id INTEGER",
  ];
  constructor() {
    super(defaultItem);
  }
}
const services = new Services();
export default services;
export type { ServicesParams };
