import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { Controller, Delete, Post, Get } from "../decorators/router.decorators";
import { FindDoc } from "../types/public.types";
import { BlogIdDto, CreateBlogDto } from "./blog.dto";
import { BlogService } from "./blog.service";
import { IBlog } from "./blog.type";

const blogService: BlogService = new BlogService()
@Controller("/blog")
export class BlogController {
    @Post()
    async createBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const blogDto: CreateBlogDto = plainToClass(CreateBlogDto, req.body);
            const blog: IBlog = await blogService.create(blogDto);
            return res.status(201).json({
                statusCode: 201,
                message: "created",
                data: { blog }
            })
        } catch (error) {
            next(error)
        }
    }
    @Get()
    async GetAllBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs: IBlog[] = await blogService.fetchAll();
            return res.status(200).json({
                statusCode: 200,
                data: {
                    blogs
                }
            })
        } catch (error) {
            next(error)
        }
    }
    @Get("/find/:id")
    async GetBlogByID(req: Request, res: Response, next: NextFunction) {
        try {
            const blogDto: BlogIdDto = plainToClass(BlogIdDto, req.params)
            const blog: FindDoc<IBlog> = await blogService.fetchByID(blogDto);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    blog
                }
            })
        } catch (error) {
            next(error)
        }
    }
    @Delete("/delete/:id")
    async RemoveBlogByID(req: Request, res: Response, next: NextFunction) {
        try {
            const blogDto: BlogIdDto = plainToClass(BlogIdDto, req.params)
            const message: string = await blogService.removeByID(blogDto);
            return res.status(200).json({
                statusCode: 200,
                message
            })
        } catch (error) {
            next(error)
        }
    }
}