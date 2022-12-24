import express from "express";
import DepartmentDao from "../daos/department.dao";
import TenantConfigDao from "../daos/tenantConfig.dao";
import TenantDao from "../daos/tenant.dao";

class PublicController {
  async getPublicDepartments(req: express.Request, res: express.Response) {
    const result = await DepartmentDao.getDepartmentPublic({
      order: req.query.order || 'ASC',
      sort: req.query.sort || 'name',
      limit: req.query.limit || 20,
      offset: req.query.page || 1,
      tenantId: req.params.tenantId,
    });
    return result;
  }

  async getTenantDetails(req: express.Request, res: express.Response) {
    const result = await TenantConfigDao.getTenantConfigPublic({
      id: req.params.id,
    });
    return result;
  }
  // async getTenantDetails(req: express.Request, res: express.Response) {
  //   const result = await TenantDao.getTenantDetails({
  //     id: req.params.id,
  //     ...req.body,
  //   });
  //   return result;
  // }
}

export default new PublicController();
