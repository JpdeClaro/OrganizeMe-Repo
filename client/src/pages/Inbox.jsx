import { useContext } from "react";
// import {UserContext} from '../../context/userContext'
import Sidebar from "../components/Sidebar";
import "../css/inbox.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import profIcon from "../assets/profile-icon.png";
import { toast } from "react-hot-toast";
import EditModal from "../components/EditModal";

//Maglagay ng websocket para autoupdate

const Inbox = () => {
  const userId = window.localStorage.getItem("id");
  const [tasklist, setTasklist] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3333/tasklist/user-tasks/" + userId)
      .then((userTasks) => {
        setTasklist(userTasks.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [username, setUsername] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3333/auth/username/" + userId)
      .then((user) => {
        setUsername(user.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const deleteTask = (id) => {
    toast("Deleted Task", {
      icon: "🗑️",
    });
    axios
      .delete("http://localhost:3333/tasklist/delete/" + id)
      .then((result) => {
        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const taskDone = (id) => {
    toast("Congratulations on finishing this task", {
      icon: "🥳",
    });
    axios
      .delete("http://localhost:3333/tasklist/delete/" + id)
      .then((result) => {
        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = (taskId) => {
    setIsEditModalOpen(true);
    window.localStorage.setItem("taskId", taskId);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <div className="inbox-page-container">
      <Sidebar userimg={profIcon} username={username.username} />

      <main className="inbox-page">
        <div className="inbox-heading">
          <i class="fa-solid fa-inbox inbox-heading-icon"></i>
          <h1>Inbox</h1>
        </div>
        <div class="row justify-content-end">
          <div class="col-2 sort-by">
            <i class="fa-solid fa-sliders sort-by-icon"></i>
            <h5>Sort By</h5>
          </div>
        </div>

        {isEditModalOpen && <EditModal closeEditModal={closeEditModal} />}
        {tasklist.map((task) => (
          <div>
            <div
              className="row priorities-list"
              style={{ display: "flex", gap: "20px" }}
              id="myList"
            >
              <div className="col-10 Today_header">
                <span onClick={() => taskDone(task._id)}>
                  <input
                    class="form-check-input"
                    type="radio"
                    name="radioNoLabel"
                    id="radioNoLabel1"
                    value=""
                    aria-label="..."
                    style={{ cursor: "pointer" }}
                  ></input>
                </span>
                <div>
                  <div>
                    <li>{task.task_title}</li>
                    <li className="task-desc">
                      <small>{task.task_description}</small>
                    </li>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <li className="task-categ">
                        <small>{task.category}</small>
                        <small>{task.today}</small>
                        <small>{task.priority}</small>
                      </li>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col Today_icons">
                <span
                  onClick={() => openEditModal(task._id)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-pen-to-square edit-btn"></i>
                </span>
                <span
                  onClick={() => deleteTask(task._id)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-trash-can delete-btn"></i>
                </span>
              </div>
              <hr />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Inbox;
