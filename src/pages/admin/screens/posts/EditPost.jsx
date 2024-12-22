import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { getSinglePost, updatePost } from "../../../../services/index/posts";
import { Link, useParams, useNavigate } from "react-router-dom";
import ArticleDetailSkeleton from "../../../articleDetail/components/ArticleDetailSkeleton";
import ErrorMessage from "../../../../components/ErrorMessage";
import { stables } from "../../../../constants";
import { HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../../../../services/index/postCategories";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const EditPost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [subscribeLevel, setSubscribeLevel] = useState(null);
  const [postSlug, setPostSlug] = useState(slug);
  const [caption, setCaption] = useState("");
  const [isActive, setIsActive] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setIsActive(data.is_active);
      setSubscribeLevel(data.subscribe_level);
    },
    refetchOnWindowFocus: false,
  });


  const {
    mutate: mutateUpdatePostDetail,
    isLoading: isLoadingUpdatePostDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Post is updated");
      navigate(`/admin/posts/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();
    console.log(photo)
    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let reponse = await fetch(url);
        let blob = await reponse.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );

      updatedData.append("postPicture", picture);
    }

    updatedData.append(
      "document",
      JSON.stringify({ body, categories, title, slug: postSlug, caption, is_active: isActive, subscribe_level: subscribeLevel })
    );

    const datatest = Object.fromEntries(updatedData.entries())
    const json = JSON.stringify(datatest)

    mutateUpdatePostDetail({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  const handleDeleteImage = () => {
    if (window.confirm("Do you want to delete your Post picture?")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  let isPostDataLoaded = !isLoading && !isError;

  const handleIsActiveCheck = (event) => {
    const initialCheckValue = !event.target.checked;
    setIsActive(event.target.checked)
    JSON.stringify({ is_active: !initialCheckValue })

  };

  const optionsSubscribeLevel = [
    {value: 0, label: 'Level 0'},
    {value: 1, label: 'Level 1'},
    {value: 2, label: 'Level 2'},
    {value: 3, label: 'Level 3'},
  ]

  return (
    <div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
            >
              Delete Image
            </button>
            <div className="mt-7 flex gap-2">
              <div>Is Active</div>
              <input
                type="checkbox"
                className="d-checkbox disabled:bg-orange-400 disabled:opacity-100 checked:bg-[url('../public/images/check.png')] bg-cover checked:disabled:bg-none"
                defaultChecked={data?.is_active}
                onChange={(event) => handleIsActiveCheck(event)}
              />
            </div>
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  to={`/blog?category=${category.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="title">
                <span className="d-label-text">Title</span>
              </label>
              <input
                id="title"
                value={title}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="caption">
                <span className="d-label-text">caption</span>
              </label>
              <input
                id="caption"
                value={caption}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="caption"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="slug">
                <span className="d-label-text">slug</span>
              </label>
              <input
                id="slug"
                value={postSlug}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) =>
                  setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                placeholder="post slug"
              />
            </div>
            {/*<div className="mb-5 mt-2">*/}
            {/*  <label className="d-label">*/}
            {/*    <span className="d-label-text">Subscribe level</span>*/}
            {/*  </label>*/}
            {/*  {isPostDataLoaded && (*/}
            {/*    <CreatableSelect*/}
            {/*      loadOptions={promiseOptions}*/}
            {/*      defaultValue={data.categories.map(categoryToOption)}*/}
            {/*      onChange={(newValue) =>*/}
            {/*        setCategories(newValue.map((item) => item.value))*/}
            {/*      }*/}
            {/*    />*/}
            {/*  )}*/}
            {/*</div>*/}
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">Subscribe level</span>
              </label>
              {isPostDataLoaded && (
                <CreatableSelect
                  defaultValue={optionsSubscribeLevel.find(item => data.subscribe_level === item.value)}
                  options={optionsSubscribeLevel}
                  onChange={(newValue) =>
                    setSubscribeLevel(newValue.value)
                  }
                  className="relative z-20"
                />
              )}
            </div>
            <div className="w-full">
              {isPostDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}

                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetail}
              type="button"
              onClick={handleUpdatePost}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Update Post
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditPost;
