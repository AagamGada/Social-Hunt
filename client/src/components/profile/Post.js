import React, { useState, useContext, useEffect } from "react";
import "../../style/Post.css";
import { MoreVert, Favorite, ThumbUpAlt } from "@material-ui/icons";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
export default function Post(props) {
  const { postState, postDispatch } = useContext(PostContext);
  const { userState, userDispatch } = useContext(UserContext);
  const [allComments, setAllComments] = useState(0);
  const [dropDown, setDropDown] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  async function getPersonalPost() {
    try {
      const { data } = await axios.get("/api/post/personalPost");
      postDispatch({ type: "POSTS_LOADED", payload: data });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  async function getAllComments() {
    try {
      const { data } = await axios.get(`/api/comment/${props.post._id}`);
      postDispatch({ type: "COMMENTS_LOADED", payload: data });
      setAllComments(data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleComment = async (ev) => {
    ev.preventDefault();
    try {
      if (comment === "") {
        return enqueueSnackbar("Empty Comment", { variant: "error" });
      }
      const { data } = await axios.post(`/api/comment/${props.post._id}`, {
        comment: comment,
      });
      postDispatch({ type: "POST_COMMENTS", payload: data });
      getAllComments();
      enqueueSnackbar("Posted Successfully", { variant: "success" });
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.put(`/api/post/likes/${props.post._id}`);
      postDispatch({ type: "POST_LOADED", payload: data });
      setIsLike(true);
      if (props.post.likes.includes(userState.user._id)) {
        setIsLike(false);
      }
      getPersonalPost();
    } catch (err) {
      console.log(err);
    }
  };
  const deletePost = async (ev) => {
    ev.preventDefault();
    try {
      await axios.delete(`/api/post/${props.post._id}`);
      getPersonalPost();
    } catch (err) {
      console.log(err);
    }
  };
  const openDropDown = () => {
    if (!dropDown) {
      setDropDown(true);
    } else {
      setDropDown(false);
    }
  };
  useEffect(() => {
    getAllComments();
    return () => {
      postDispatch({ type: "COMMENTS_UNLOADED" });
    };
  }, []);
  let month = new Date(props.post.createdAt).toLocaleString("default", {
    month: "short",
  });
  let red =
    props.post?.likes.includes(userState.user?._id) || isLike
      ? { htmlColor: "red" }
      : { htmlColor: "grey" };
  let day = new Date(props.post.createdAt).getDate();
  return (
    <div className="post" style={{ background: "white" }}>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img className="postTopImg" src={userState.user?.image} alt="" />
            <span className="postUser">{props.post.user.name}</span>
            <span className="postDate">{`${month} ${day}`}</span>
          </div>
          <div className="postTopRight">
            <i class="fas fa-ellipsis-v" onClick={openDropDown}>
              {dropDown && (
                <div className="dropDown">
                  <ul>
                    <li onClick={deletePost}>delete</li>
                  </ul>
                </div>
              )}
            </i>
          </div>
        </div>
        <div className="postCenter">
          <span className="text">{props.post.content}</span>
          {props.post.image && (
            <img src={props.post.image} alt="" className="postImg" />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite {...red} className="likeIcon" onClick={handleLike} />
            <span className="postLikeCounter">
              {props.post.likes.length} Likes
            </span>
          </div>
          <div className="postBottomRight">
            <Link to={`/post/${props.post._id}`}>
              <span className="postCommentText">
                {allComments.length} comments
              </span>
            </Link>
          </div>
        </div>
        <div className="comments">
          <input
            type="text"
            value={comment}
            className="postComment"
            placeholder="Add a comment.."
            onChange={(ev) => setComment(ev.target.value)}
          ></input>
          <button
            variant="contained"
            className="commentButton"
            onClick={handleComment}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
