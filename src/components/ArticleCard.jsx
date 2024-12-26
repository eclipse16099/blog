import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import moment from 'moment';

import { images, stables } from "../constants";
import { Link } from "react-router-dom";
import Editor from "./editor/Editor";

const ArticleCard = ({ post, className }) => {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
    >
      {/*<Link to={`/blog/${post.slug}`}>*/}
      {/*  <img*/}
      {/*    src={*/}
      {/*      post.photo*/}
      {/*        ? stables.UPLOAD_FOLDER_BASE_URL + post.photo*/}
      {/*        : images.samplePostImage*/}
      {/*    }*/}
      {/*    alt="title"*/}
      {/*    className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"*/}
      {/*  />*/}
      {/*</Link>*/}
      <div className="p-5">
        <div className="flex justify-between flex-nowrap items-center mt-6">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            <img
              src={
                post.user.avatar
                  ? stables.UPLOAD_FOLDER_BASE_URL + post.user.avatar
                  : images.userImage
              }
              alt="post profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full"
            />
            <div className="flex flex-col">
              <h4 className="font-bold italic text-dark-soft text-sm md:text-base">
                {post.user.name}
              </h4>
            </div>
          </div>
          <span className="font-bold text-dark-light italic text-sm md:text-base">
            {/*{moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a')}*/}
            {moment(post.createdAt).format('DD.MM.YY, hh:mm:ss')}
          </span>
        </div>
        {/*<h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">*/}
        {/*  {post.title}*/}
        {/*</h2>*/}
        <p className="text-dark-light mt-3 text-sm md:text-lg">
          <Editor content={post?.body} editable={false} />
        </p>

      </div>
    </div>
  );
};

export default ArticleCard;
