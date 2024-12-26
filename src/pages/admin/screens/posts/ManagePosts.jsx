import React, {useEffect} from 'react'
import { images, stables } from "../../../../constants";
import {deletePost, getAllPosts, updatePost} from "../../../../services/index/posts";
import Pagination from "../../../../components/Pagination";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import {useMutation} from "@tanstack/react-query";
import {updateProfile} from "../../../../services/index/users";
import Editor from "../../../../components/editor/Editor";
import moment from "moment";

const ManagePosts = () => {
  const {
    userState,
    currentPage,
    searchKeyword,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(userState.userInfo.token, searchKeyword, currentPage),
    dataQueryKey: "posts",
    deleteDataMessage: "Post is deleted",
    mutateDeleteFn: ({ slug, token }) => {
      return deletePost({
        slug,
        token,
      });
    },
  });

  const { mutate: mutateUpdatePostDetail } =
    useMutation({
      mutationFn: ({ updatedData, slug, token }) => {
        return updatePost({
          updatedData,
          slug,
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["blog"]);
        toast.success("Post is updated");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleIsActiveCheck = (event, slug, token) => {
    const initialCheckValue = !event.target.checked;

    let updatedData = new FormData();


    updatedData.append("postPicture", JSON.stringify(null));

    updatedData.append(
      "document",
      JSON.stringify({ postPicture: {}, is_active: !initialCheckValue, slug: slug, body: null })
    );

    if (
      window.confirm("Do you want to change the active status of this post?")
    ) {
      mutateUpdatePostDetail({
          updatedData,
          slug,
          token: userState.userInfo.token,
        }
      );
    } else {
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return () => {
      console.log(searchParams)
    };
  }, [postsData]);


  return (
    <DataTable
      pageTitle="Manage Posts"
      dataListName="Posts"
      isHiddenSearch={true}
      tableHeaderTitleList={["Content", "Created At", "Is Active", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={postsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={postsData?.headers}
      userState={userState}
    >
      {postsData?.data.map((post) => (
        <tr>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              {/*<div className="flex-shrink-0">*/}
              {/*  <a href="/" className="relative block">*/}
              {/*    <img*/}
              {/*      src={*/}
              {/*        post?.photo*/}
              {/*          ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo*/}
              {/*          : images.samplePostImage*/}
              {/*      }*/}
              {/*      alt={post.title}*/}
              {/*      className="mx-auto object-cover rounded-lg w-10 aspect-square"*/}
              {/*    />*/}
              {/*  </a>*/}
              {/*</div>*/}
              <div className="ml-3">
                <Editor content={post?.body} editable={false}/>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {moment(post.createdAt).format('DD.MM.YY, hh:mm:ss')}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex gap-x-2 disabled">
              {/*<input*/}
              {/*  type="checkbox"*/}
              {/*  className="d-checkbox disabled:bg-orange-400 disabled:opacity-100 checked:bg-[url('../public/images/check.png')] bg-cover checked:disabled:bg-none"*/}
              {/*  defaultChecked={post?.is_active}*/}
              {/*  onChange={(event) => {*/}
              {/*    handleIsActiveCheck(event, post?.slug, userState.userInfo.token,)*/}
              {/*  }}*/}
              {/*/>*/}

              {post?.is_active ? "✅" : "❌"}
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: post?.slug,
                  token: userState.userInfo.token,
                });
              }}
            >
              Delete
            </button>
            <Link
              to={`/admin/posts/manage/edit/${post?.slug}`}
              className="text-green-600 hover:text-green-900"
            >
              Edit
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default ManagePosts;
