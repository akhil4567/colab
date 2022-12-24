import { db } from "../../../database/connection";
const Sequelize = db.dbInterface.Sequelize;
import { log } from "../common/classes/log.class";
import {config} from "../common/config/config";
import getSignedFileUrl from "../common/utils/s3FileFetch";
const { Op } = require("sequelize");
let attributesExclusions = ['createdBy','updatedBy','deletedAt','createdAt','updatedAt'];

class DocumentDao {
  constructor() {
    // log('Created new instance of Dao');
  }

  async getDocuments(data: any) {
    let where_clause: any = {};
    if (data.customerId) {
      where_clause.customerId = data.customerId
    }
    const {rows,count}: any = await db.dbInterface.models.Document.findAndCountAll({
      where: where_clause,
      attributes: {
        exclude: attributesExclusions,
      },
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      distinct:true
    });

    return {data:rows,documentCount:count};
  }

  async getDownloadLink(data: any) {
    const document: any = await db.dbInterface.models.Document.findOne({
        where: { id: data.id },
      });
    const url = await getSignedFileUrl(document.dataValues.fileKey , config.s3.uploadProfileImageBucket, 3600);
    return url;
  }

  async getDeletedDocuments(data: any) {
    const documents: any = await db.dbInterface.models.Document.findAll({
      where: {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      limit: data.limit,
      offset: data.offset > 0 ? --data.offset * data.limit : 0,
      paranoid: false,
    });

    return documents;
  }

  async createDocument(data: any) {
    const document: any = await db.dbInterface.models.Document.create({
      name: data.name,
      documentType: data.documentType,
      fileKey: data.fileKey,
      fileName: data.fileName,
      mimeType: data.mimeType,
      customerId: data.customerId,
    });

    return document;
  }

  async updateDocument(data: any) {
    const document: any = await db.dbInterface.models.Document.update(
      {
        name: data.name,
        documentType: data.documentType,
        fileKey: data.fileKey,
        fileName: data.fileName,
        mimeType: data.mimeType,
        customerId: data.customerId,
      },
      { where: { id: data.id }, returning: true }
    );

    return document[1];
  }

   async deleteDocument(data: any){
      const document: any = await db.dbInterface.models.Document.destroy({
        where: { id: data.id },
      });
      log.info("Document (Destroy) --> ", JSON.stringify(document));

      return document[1];
    }
}

export default new DocumentDao();
