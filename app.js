const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());

let db = null;

const initializetheDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3010, () => {
      console.log("SERVER IS RUNNING AT http://localhost:3010/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializetheDBandServer();

// app.get("/todos/", async (request, response) => {
//   const gettingall = `SELECT * FROM todo;`;
//   const dss = await db.all(gettingall);
//   response.send(dss);
// });

//API1

app.get("/todos/", async (request, response) => {
  let gettingtheQuery = "";
  let dbResponse = null;
  let result = null;
  let convertingtheresult = (arrayarg) => {
    result = arrayarg.map((each) => {
      return {
        id: each.id,
        todo: each.todo,
        priority: each.priority,
        status: each.status,
        category: each.category,
        dueDate: each.due_date,
      };
    });
    return result;
  };
  const {
    category = "",
    status = "",
    priority = "",
    search_q = "",
  } = request.query;

  if (request.query.status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      gettingtheQuery = `SELECT * FROM todo WHERE status='${status}';`;
      dbResponse = await db.all(gettingtheQuery);
      //   console.log(convertingtheresult(dbResponse));
      response.send(convertingtheresult(dbResponse));
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (request.query.priority !== undefined) {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      gettingtheQuery = `SELECT * FROM todo WHERE priority='${priority}';`;
      dbResponse = await db.all(gettingtheQuery);
      //   console.log(convertingtheresult(dbResponse));
      response.send(convertingtheresult(dbResponse));
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (
    request.query.priority !== undefined &&
    request.query.status !== undefined
  ) {
    gettingtheQuery = `SELECT * FROM todo WHERE status='${status}' priority='${priority}';`;
    dbResponse = await db.all(gettingtheQuery);
    //   console.log(convertingtheresult(dbResponse));
    response.send(convertingtheresult(dbResponse));
  } else if (request.query.search_q !== undefined) {
    gettingtheQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
    dbResponse = await db.all(gettingtheQuery);
    response.send(convertingtheresult(dbResponse));
  } else if (
    request.query.category !== undefined &&
    request.query.status !== undefined
  ) {
    gettingtheQuery = `SELECT * FROM todo WHERE category='${category}' status='${status}';`;
    dbResponse = await db.all(gettingtheQuery);
    response.send(convertingtheresult(dbResponse));
  } else if (
    request.query.category !== undefined &&
    request.query.priority !== undefined
  ) {
    gettingtheQuery = `SELECT * FROM todo WHERE category='${category}' priority='${priority}';`;
    dbResponse = await db.all(gettingtheQuery);
    response.send(convertingtheresult(dbResponse));
  } else if (request.query.category !== undefined) {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      gettingtheQuery = `SELECT * FROM todo WHERE category='${category}';`;
      dbResponse = await db.all(gettingtheQuery);
      //   console.log(convertingtheresult(dbResponse));
      response.send(convertingtheresult(dbResponse));
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  }
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let convertingtheresult2 = (resultobject) => {
    return {
      id: resultobject.id,
      todo: resultobject.todo,
      priority: resultobject.priority,
      status: resultobject.status,
      category: resultobject.category,
      dueDate: resultobject.due_date,
    };
  };
  const gettinrIDquery = `SELECT * FROM todo WHERE id=${todoId};`;
  const dbressponse2 = await db.get(gettinrIDquery);
  //   console.log(dbressponse2);
  //   console.log(convertingtheresult2(dbressponse2));
  response.send(convertingtheresult2(dbressponse2));
});

//API 3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  let gettingtheQuery = "";
  let dbResponse = null;
  let result = null;
  let convertingtheresult = (arrayarg) => {
    result = arrayarg.map((each) => {
      return {
        id: each.id,
        todo: each.todo,
        priority: each.priority,
        status: each.status,
        category: each.category,
        dueDate: each.due_date,
      };
    });
    return result;
  };
  //   console.log(date);
  //   console.log(typeof date);
  let newDate = new Date(date);
  console.log(isValid(newDate));
  //   console.log(newDate);
  //   console.log(newDate.getDate());
  //   console.log(newDate.getMonth() + 1);
  //   console.log(newDate.getFullYear());

  //   console.log(newDateFormat);

  if (isValid(newDate)) {
    let newDateFormat = format(
      new Date(
        `${newDate.getFullYear()},${
          newDate.getMonth() + 1
        },${newDate.getDate()}`
      ),
      "yyyy-MM-dd"
    );
    console.log(newDateFormat);
    gettingtheQuery = `SELECT * FROM todo WHERE due_date='${newDateFormat}';`;
    dbResponse = await db.all(gettingtheQuery);
    response.send(convertingtheresult(dbResponse));
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//API4

app.post("/todos/", async (request, response) => {
  console.log(request.body);
  let gettingQuery = "";
  let dbResponse = null;

  //   gettingQuery = `INSERT INTO todo(id,todo,priority,status,category,due_date) VALUES(
  //         '${id}','${todo}','${priority}','${status}','${category}','${dueDate}'
  //     );`;
  //    dbResponse = await db.run(gettingQuery);
  //   response.send("Todo Successfully Added");

  const {
    id,
    todo = "",
    priority = "",
    status = "",
    category = "",
    dueDate = "",
  } = request.body;
  if (request.body.status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          category === "WORK" ||
          category === "HOME" ||
          category === "LEARNING"
        ) {
          let newDatepost = new Date(dueDate);
          if (isValid(newDatepost)) {
            let newDateFormatpost = format(
              new Date(
                `${newDatepost.getFullYear()},${
                  newDatepost.getMonth() + 1
                },${newDatepost.getDate()}`
              ),
              "yyyy-MM-dd"
            );
            gettingQuery = `INSERT INTO todo(id,todo,priority,status,category,due_date) VALUES(${id},'${todo}','${priority}','${status}','${category}','${newDateFormatpost}');`;
            dbResponse = await db.run(gettingQuery);
            response.send("Todo Successfully Added");
          } else {
            response.status(400);
            response.send("Invalid Due Date");
          }
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  }
});

//API 5

app.put("/todos/:todoId/", async (request, response) => {
  const {
    todo = "",
    status = "",
    priority = "",
    category = "",
    dueDate = "",
  } = request.body;
  const { todoId } = request.params;
  let updateQuery = "";
  let dbResponse5 = null;
  if (request.body.status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      updateQuery = `UPDATE todo SET status='${status}' WHERE id=${todoId};`;
      dbResponse5 = await db.run(updateQuery);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (request.body.todo !== undefined) {
    updateQuery = `UPDATE todo SET todo='${todo}' WHERE id=${todoId};`;
    dbResponse5 = await db.run(updateQuery);
    response.send("Todo Updated");
  } else if (request.body.priority !== undefined) {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      updateQuery = `UPDATE todo SET priority='${priority}' WHERE id=${todoId};`;
      dbResponse5 = await db.run(updateQuery);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (request.body.category !== undefined) {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      updateQuery = `UPDATE todo SET category='${category}' WHERE id=${todoId};`;
      dbResponse5 = await db.run(updateQuery);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (request.body.dueDate !== undefined) {
    let newDate1 = new Date(dueDate);
    console.log(isValid(newDate1));
    console.log(newDate1.getMonth() + 1);
    if (isValid(newDate1)) {
      let newDateFormat1 = format(
        new Date(
          `${newDate1.getFullYear()},${
            newDate1.getMonth() + 1
          },${newDate1.getDate()}`
        ),
        "yyyy-MM-dd"
      );
      console.log(newDateFormat1);
      updateQuery = `UPDATE todo SET due_date='${newDateFormat1}' WHERE id=${todoId};`;
      dbResponse5 = await db.run(updateQuery);
      response.send("Due Date Updated");
    } else {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }
});

//API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `DELETE FROM todo WHERE id=${todoId};`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;
