import React, { useState, useContext, useEffect } from "react";
import "../../style/CenterBar.css";
import UserPosts from "./Post";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { PostContext } from "../../context/PostContext";
import axios from "../../utils/axios";
import { useSnackbar } from "notistack";
import { useParams } from "react-router";
export default function CenterBar() {
  const params = useParams();
  const { postState, postDispatch } = useContext(PostContext);
  async function getUserPost() {
    try {
      const userId = params.userId;
      const { data } = await axios.get(`/api/post/user/${userId}`);
      postDispatch({ type: "POSTS_LOADED", payload: data });
      console.log(data);
      console.log(postState.posts);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getUserPost();
    return () => {
      postDispatch({ type: "POSTS_UNLOADED" });
    };
  }, [params.userId]);
  return (
    <div className="CenterBar">
      {postState.posts.length>0 ? (
        <div className="centerWrapper">
          {postState.posts.slice(0).map((post) => {
            return <UserPosts post={post} key={post._id} />;
          })}
        </div>
      ) : (
        <div className="noPost">
           No Post Uploaded
        </div>
      )}
      {console.log(postState.posts)}
    </div>
  );
}
