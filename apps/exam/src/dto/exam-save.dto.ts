import { IsNotEmpty, IsString } from 'class-validator';

export class ExamSaveDto {
  @IsNotEmpty({ message: '考试 id 不能为空' })
  id: number;

  @IsString({ message: '考试内容必须是字符串' })
  content: string;
}
