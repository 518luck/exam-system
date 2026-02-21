import { Injectable, StreamableFile } from '@nestjs/common';
import { Column, Workbook } from 'exceljs';
import { PassThrough } from 'stream';

@Injectable()
export class ExcelService {
  async export(
    //Partial 是 TypeScript 内置的一个工具类型。它的作用是：把一个类型里的所有属性都变成“可选的”（Optional）。
    columns: Partial<Column>[],
    data: Array<Record<string, any>>,
    filename: string,
  ) {
    // Workbook（工作簿）
    const workbook = new Workbook();

    // 新建一张表格
    // 在 Excel 的真实界面中，一个 .xlsx 文件底部可以有很多个选项卡（标签页），每一个选项卡就是一个 Worksheet（工作表）。
    const worksheet = workbook.addWorksheet('guang111');

    // 设置表头
    worksheet.columns = columns;
    // [
    //   { header: 'ID', key: 'id', width: 20 },
    //   { header: '姓名', key: 'name', width: 30 },
    //   { header: '出生日期', key: 'birthday', width: 30 },
    //   { header: '手机号', key: 'phone', width: 50 },
    // ];

    // 数据
    // const data = [
    //   {
    //     id: 1,
    //     name: '光光',
    //     birthday: new Date('1994-07-07'),
    //     phone: '13255555555',
    //   },
    //   {
    //     id: 2,
    //     name: '东东',
    //     birthday: new Date('1994-04-14'),
    //     phone: '13222222222',
    //   },
    //   {
    //     id: 3,
    //     name: '小刚',
    //     birthday: new Date('1995-08-08'),
    //     phone: '13211111111',
    //   },
    // ];

    //往表里填数据
    worksheet.addRows(data);

    //创建一个中转管道。 Stream 是一个具备特定行为的“数据传输对象”。
    const stream = new PassThrough();

    await workbook.xlsx.write(stream);

    return new StreamableFile(stream, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=' + filename,
    });
  }
}
