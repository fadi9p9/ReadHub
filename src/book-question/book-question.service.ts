import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookQuestion } from './entities/book-question.entity';
import { BookQuestionTranslation } from './entities/book-question-translation.entity';
import { CreateBookQuestionDto } from './dto/create-book-question.dto';
import { UpdateBookQuestionDto } from './dto/update-book-question.dto';

@Injectable()
export class BookQuestionsService {
  constructor(
    @InjectRepository(BookQuestion)
    private readonly questionRepository: Repository<BookQuestion>,
    @InjectRepository(BookQuestionTranslation)
    private readonly translationRepository: Repository<BookQuestionTranslation>
  ) {}

  async create(createDto: CreateBookQuestionDto) {
    const question = this.questionRepository.create({
      // bookId: createDto.bookId,
       book: { id: createDto.bookId },
      question_text: createDto.question_text,
      option_a: createDto.option_a,
      option_b: createDto.option_b,
      option_c: createDto.option_c,
      option_d: createDto.option_d,
      correct_option: createDto.correct_option,
      quiz: { id: createDto.quizId }
    });

    const savedQuestion = await this.questionRepository.save(question);

    if (createDto.translations) {
      const translations = createDto.translations.map(trans => ({
        ...trans,
        question: savedQuestion
      }));
      await this.translationRepository.save(translations);
    }

    return this.findOne(savedQuestion.id);
  }

   async findAllWithPagination(page: number = 1, limit: number = 10, lang?: string) {
  const skip = (page - 1) * limit;
  
  const query = this.questionRepository
    .createQueryBuilder('question')
    .leftJoinAndSelect('question.translations', 'translation')
    .leftJoinAndSelect('question.quiz', 'quiz')
    .take(limit)
    .skip(skip);

  if (lang) {
    query.where(
      '(translation.lang = :lang AND translation.question_text IS NOT NULL) OR (translation.id IS NULL AND :lang = \'en\')', 
      { lang }
    );
  }

  const [questions, total] = await query.getManyAndCount();

  const processedQuestions = questions.map(question => {
    if (lang) {
      const translation = question.translations?.find(t => t.lang === lang);
      if (translation || lang === 'en') {
        return {
          ...question,
          question_text: translation?.question_text || question.question_text,
          option_a: translation?.option_a || question.option_a,
          option_b: translation?.option_b || question.option_b,
          option_c: translation?.option_c || question.option_c,
          option_d: translation?.option_d || question.option_d,
          translations: undefined
        };
      }
      return null;
    }
    return question;
  }).filter(q => q !== null);

  return {
    data: processedQuestions,
    meta: {
      total: processedQuestions.length,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      has_previous_page: page > 1,
      has_next_page: page < Math.ceil(total / limit),
      previous_page: page > 1 ? page - 1 : null,
      next_page: page < Math.ceil(total / limit) ? page + 1 : null
    }
  };
}

  async findOne(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['translations', 'quiz']
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, updateDto: UpdateBookQuestionDto) {
    const question = await this.questionRepository.preload({
      id,
      ...updateDto,
      quiz: updateDto.quizId ? { id: updateDto.quizId } : undefined
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    if (updateDto.translations) {
      await this.translationRepository.delete({ question: { id } });
      const translations = updateDto.translations.map(trans => ({
        ...trans,
        question: { id }
      }));
      await this.translationRepository.save(translations);
    }

    return this.questionRepository.save(question);
  }

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.questionRepository.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No questions found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} questions deleted successfully`, 
      warning: 'Some questions were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} questions deleted successfully` 
  };
}

}