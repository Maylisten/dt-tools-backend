import {addFileTag, decrypt, encrypt, gzipBuffer, randomWait} from "./utils";
import path from "node:path";
import {Step} from "../types/Process";
import {Readable} from "node:stream";
import {parse} from "fast-csv";
import {stringify} from "csv-stringify";

const minWaitTime = 3000
const maxWaitTime = 6000


/**
 * 兜底处理方法，随机等待
 */
const spareProcess = async (file: Express.Multer.File) => {
  await randomWait(minWaitTime, maxWaitTime)
}

type ProcessHandler = (file: Express.Multer.File) => Promise<Express.Multer.File>;

type DataProcessorType = {
  [key in Step]: ProcessHandler; // 动态根据 Step 的每个值生成对应的属性
}

interface DataProcessor extends DataProcessorType {
}

/**
 * CSV 数据处理器
 */
export class CsvDataProcessor implements DataProcessor {
  private async readBufferFromCsv(buffer: Buffer) {
    return new Promise<string[][]>((resolve, reject) => {
      const parser = parse();
      // 存储数据
      const csvData: string[][] = [];
      const readStream = Readable.from(buffer)
      readStream
        .pipe(parser)
        .on("data", (row: string[]) => {
          csvData.push(row);
        })
        .on("end", () => {
          readStream.destroy();
          resolve(csvData);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }

  private async convertCsvToBuffer(data: string[][]) {
    return new Promise<Buffer>((resolve, reject) => {
      stringify(data, (err, output) => {
        if (err) {
          reject(err);
        } else {
          // 假设 inputString 是用逗号分隔的字符串
          const rows = output.split('\n');
          const csvArray = rows.map(row => row.split(','));
          const csvString = csvArray.map(row => row.join(',')).join('\n');
          const csvBuffer = Buffer.from(csvString, 'utf-8');
          resolve(csvBuffer);
        }
      });
    })
  }

  // Remove duplicate rows from the CSV file
  async DataClean(file: Express.Multer.File): Promise<Express.Multer.File> {
    const csvData = await this.readBufferFromCsv(file.buffer)
    const data = Array.from(new Set(csvData.map(row => JSON.stringify(row)))).map(str => JSON.parse(str) as string[]);
    const buffer = await this.convertCsvToBuffer(data)
    return {
      ...file,
      originalname: addFileTag(file.originalname, "clean"),
      buffer
    }
  }

  // Sample a portion of the rows from the CSV file
  async DataSample(file: Express.Multer.File): Promise<Express.Multer.File> {
    const csvData = await this.readBufferFromCsv(file.buffer)
    const data = csvData.filter((row, index) => index % 4 === 0)
    const buffer = await this.convertCsvToBuffer(data)
    return {
      ...file,
      originalname: addFileTag(file.originalname, "sample"),
      buffer
    }
  }

  // Compress the CSV file
  async DataCompression(file: Express.Multer.File): Promise<Express.Multer.File> {
    const buffer = await gzipBuffer(file.buffer); // 压缩数据
    return {
      ...file,
      originalname: `${addFileTag(file.originalname, "compressed")}.gz`,
      buffer,
    };
  }

  // Encrypt the CSV file
  async DataEncryption(file: Express.Multer.File): Promise<Express.Multer.File> {
    const csvData = await this.readBufferFromCsv(file.buffer)
    const data = csvData.map(row => row.map(item => encrypt(item)))
    const buffer = await this.convertCsvToBuffer(data)
    return {
      ...file,
      originalname: addFileTag(file.originalname, "encryption"),
      buffer
    }
  }

  async DataDecryption(file: Express.Multer.File): Promise<Express.Multer.File> {
    const csvData = await this.readBufferFromCsv(file.buffer)
    const data = csvData.map(row => row.map(item => decrypt(item)))
    const buffer = await this.convertCsvToBuffer(data)
    return {
      ...file,
      originalname: addFileTag(file.originalname, "decryption"),
      buffer
    }
  }
}


/**
 * 备用处理器
 */
export class SpareDataProcessor implements DataProcessor {
  async DataClean(file: Express.Multer.File) {
    await spareProcess(file);
    return {
      ...file,
      originalname: addFileTag(file.originalname, "clean"),
    } as Express.Multer.File;
  }

  async DataSample(file: Express.Multer.File) {
    await spareProcess(file);
    return {
      ...file,
      originalname: addFileTag(file.originalname, "sample"),
    } as Express.Multer.File;
  }

  async DataCompression(file: Express.Multer.File) {
    await spareProcess(file);
    return {
      ...file,
      originalname: addFileTag(file.originalname, "compression"),
    } as Express.Multer.File;
  }

  async DataEncryption(file: Express.Multer.File) {
    await spareProcess(file);
    return {
      ...file,
      originalname: addFileTag(file.originalname, "encryption"),
    } as Express.Multer.File;
  }

  async DataDecryption(file: Express.Multer.File) {
    await spareProcess(file);
    return {
      ...file,
      originalname: addFileTag(file.originalname, "decryption"),
    } as Express.Multer.File;
  }
}


const DataTypeProcessorStrategies: Record<string, DataProcessor> = {
  "csv": new CsvDataProcessor()
}

export const getDataTypeProcessorStrategies = (file: Express.Multer.File): DataProcessor => {
  const dataType = path.extname(file.originalname).replace(".", "");
  return DataTypeProcessorStrategies[dataType] ?? new SpareDataProcessor();
}
