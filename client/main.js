function main() {

    function loginDisplay() {
        document.getElementById("navigation_page").style.display = "none";
        document.getElementById("login_form_id").style.display = "block";
        document.getElementById("add_book_id").style.display = "none";
        document.getElementById("signup_id").style.display = "none";
        // document.getElementById("book_container").style.display = "none";
        document.getElementById("error_div").style.display = "none";
        //document.getElementById("update_form_id").style.display = "none";
        sessionStorage.removeItem("token");
        //location.reload()
    }

    /////////////////////////////////////////////////////////////
    function displayMainPage() {
        document.getElementById("navigation_page").style.display = "block";
        document.getElementById("login_form_id").style.display = "none";
        document.getElementById("add_book_id").style.display = "block";
        //document.getElementById("book_container").style.display = "block";
        document.getElementById("signup_id").style.display = "none";
        // document.getElementById("update_form_id").style.display = "none";

    }

    function displayBookForm() {
        document.getElementById("add_book_id").style.display = "block";
        //document.getElementById("book_container").style.display = "block";
        document.getElementById("signup_id").style.display = "none";
        // document.getElementById("update_form_id").style.display = "none";

    }

    function loginDisplayP() {
        document.getElementById("navigation_page").style.display = "none";
        document.getElementById("login_form_id").style.display = "block";
        document.getElementById("add_book_id").style.display = "none";
        //document.getElementById("book_container").style.display = "none";
        document.getElementById("error_div").style.display = "none";
        document.getElementById("signup_id").style.display = "none";
        // document.getElementById("update_form_id").style.display = "none";

        sessionStorage.removeItem("token");
        location.reload()
    }
    //////////////////////////////////////////////////////////
    function displayNewUserForm(event) {
        event.preventDefault();
        document.getElementById("navigation_page").style.display = "none";
        document.getElementById("login_form_id").style.display = "none";
        document.getElementById("add_book_id").style.display = "none";
        // document.getElementById("book_container").style.display = "none";
        document.getElementById("error_div").style.display = "none";
        document.getElementById("signup_id").style.display = "block";

        // document.getElementById("update_form_id").style.display = "none";

    }


    ////////////////////////////////////////////////////////////////////////
    function displayUpdateForm() {
        //event.preventDefault()
        document.getElementById("navigation_page").style.display = "block";
        document.getElementById("login_form_id").style.display = "none";
        document.getElementById("add_book_id").style.display = "none";
        //document.getElementById("book_container").style.display = "none";
        document.getElementById("error_div").style.display = "none";
        document.getElementById("signup_id").style.display = "none";
        // document.getElementById("update_form_id").style.display = "block";

    }

    ///////////////////////////////////////////////////////////

    window.onload = function() {
        loginDisplay();
        document.getElementById("logout").onclick = loginDisplayP;
        document.getElementById("login").onclick = loginPage;
        document.getElementById("create_new_account").onclick = displayNewUserForm;
        document.getElementById("signup_form_id").onclick = addNewUser;

        document.getElementById("update_user_information_form").onclick =
            getCurrentUser;
        document.getElementById("update_user_information_btn").onclick =
            updateUserInfo;
        document.getElementById("home").onclick = displayBookForm;


        async function loginPage() {
            let username = document.getElementById("user_name").value;
            sessionStorage.setItem("username", username);
            const token = await (
                await fetch("http://localhost:3000/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: document.getElementById("user_name").value,
                        password: document.getElementById("password").value,
                    }),
                })
            ).json();
            if (token.jwtToken) {
                sessionStorage.setItem("token", token.jwtToken);
                displayMainPage();
                fetchAllBooks();
            } else {
                document.getElementById("error_div").style.display = "block";
                document.getElementById("wrong_message").innerHTML = token.error;
            }
        }

        document.getElementById("addBtn").onclick = function(event) {
            const btnId = this.dataset.id;
            event.preventDefault();
            if (btnId) {
                fetch("http://localhost:3000/books/" + btnId, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                        },
                        body: JSON.stringify({
                            ISBN: document.getElementById("ISBN").value,
                            bookTitle: document.getElementById("bookTitle").value,
                            overdueFee: document.getElementById("overdueFee").value,
                            publisher: document.getElementById("publisher").value,
                            datePublished: document.getElementById("datePublished").value

                        }),
                    })
                    .then((data) => data.json())
                    .then((res) => {
                        if (res.error !== "unauthorize") {
                            document.getElementById("form-title").textContent = "Add a Book";
                            document.getElementById("add_form").reset();
                            document.getElementById("addBtn").dataset.id = "";
                            location.reload();
                        } else {
                            alert(res.error + " to update");
                        }
                    });
            } else {
                addNewBook();
            }
        };
    };

    //fetch all books
    async function fetchAllBooks() {
        const books = await (
            await fetch("http://localhost:3000/books", {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
            })
        ).json();
        const bookDisplay = document.getElementById("display-book");
        books.forEach((data) => {
            displayToClient(bookDisplay, data);
        });
    }

    function addNewBook() {
        {
            fetch("http://localhost:3000/books", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        ISBN: document.getElementById("ISBN").value,
                        bookTitle: document.getElementById("bookTitle").value,
                        overdueFee: document.getElementById("overdueFee").value,
                        publisher: document.getElementById("publisher").value,
                        datePublished: document.getElementById("datePublished").value
                    }),
                })
                .then((data) => data.json())
                .then((data) => {
                    console.log(data.error === "unauthorize");
                    if (
                        document.getElementById("ISBN").value === "" ||
                        document.getElementById("bookTitle").value === "" ||
                        document.getElementById("overdueFee").value === "" ||
                        document.getElementById("publisher").value === "" ||
                        document.getElementById("datePublished").value === ""
                    ) {
                        alert("Please fill, all fields are required!");

                    } else {
                        alert("Book successfully added!", Date());
                        const bookContainer = document.createElement("div");
                        bookContainer.style.display = "flex";
                        const bookDisplay = document.getElementById("display-book");
                        console.log(data[0]);
                        displayToClient(bookDisplay, data[0]);

                    }


                });
        }
    }

    function displayToClient(bookDisplay, data) {
        const listInfo = document.createElement("div");
        listInfo.className = "col-lg-4";
        listInfo.style.marginTop = "10px";
        listInfo.id = data._id;
        const image = document.createElement("img");
        image.src = "./images/library3.png";
        image.alt = "image";
        image.width = "100";
        image.height = "60";
        const bookTitleH = document.createElement("h4");
        bookTitleH.innerHTML = data.bookTitle;
        const viewBtn = document.createElement("button");
        viewBtn.className = "btn btn-info";
        viewBtn.innerHTML = "view details";
        viewBtn.dataset.id = data._id;
        listInfo.append(image);
        listInfo.append(bookTitleH);
        listInfo.append(viewBtn);
        bookDisplay.append(listInfo);
        document.getElementById("add_form").reset();
        viewBtn.addEventListener("click", function() {
            const viewDetail = document.getElementById(`${data._id}`);
            const isbn = document.createElement("h6");
            isbn.innerHTML = "ISBN :" + data.ISBN;
            viewDetail.appendChild(isbn);
            const datePublished = document.createElement("h6");
            let date = new Date(data.datePublished);
            let dFormat =
                date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            datePublished.innerHTML = "Date Published: " + dFormat;
            viewDetail.appendChild(datePublished);
            const publisher = document.createElement("h6");
            publisher.innerHTML = "Publisher: " + data.publisher;
            viewDetail.appendChild(publisher);
            const overdueFee = document.createElement("h6");
            overdueFee.innerHTML = "OverdueFee: " + data.overdueFee;
            viewDetail.appendChild(overdueFee);
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-danger";
            deleteBtn.innerHTML = "Delete";
            deleteBtn.dataset.id = data._id;
            viewDetail.append(deleteBtn);

            //update button
            const updateBtn = document.createElement("button");
            updateBtn.className = "btn btn-warning";
            updateBtn.innerHTML = "Update";
            updateBtn.dataset.id = data._id;
            viewDetail.append(updateBtn);


            deleteBtn.addEventListener("click", deleteBook);

            function deleteBook() {
                fetch("http://localhost:3000/books/" + data._id, {
                        method: "DELETE",
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                        },
                    })
                    .then((data) => data.json())
                    .then((res) => {
                        let result = confirm("Are you sure you want to delete this book? ");
                        if (result && res.error !== "unauthorize") {

                            viewDetail.remove();
                        } else {

                        }
                    });
            }

            //update books
            updateBtn.addEventListener("click", getBook);

            function getBook() {
                fetch("http://localhost:3000/books/" + data._id, {
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                        },
                    })
                    .then((data) => data.json())
                    .then((data) => {
                        document.getElementById("form-title").textContent = "Edit A Book";
                        document.getElementById("ISBN").value = data.ISBN,
                            document.getElementById("bookTitle").value = data.bookTitle,
                            document.getElementById("overdueFee").value = data.overdueFee,
                            document.getElementById("publisher").value = data.publisher,
                            document.getElementById("datePublished").value = data.datePublished,
                            document.getElementById("addBtn").dataset.id = data._id;
                    });
            }

        });
    }


    async function addNewUser() {

        let firstName = document.getElementById("first_name").value;
        let lastName = document.getElementById("last_name").value;
        let userName = document.getElementById("user_name_id").value;
        let password = document.getElementById("inputPassword").value;

        if (
            firstName === "" ||
            lastName === "" ||
            userName === "" ||
            password === ""
        ) { alert("Please fill all the required fields!"); }

        if (!(
                firstName === "" ||
                lastName === "" ||
                userName === "" ||
                password === ""
            )) {
            let result = await (
                await fetch("http://localhost:3000/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        userName: userName,
                        password: password

                    }),
                })
            ).json();
            if (result.exist) {

                document.getElementById("user_name_id").style.color = "red";
                document.getElementById("user_name_id").value = "This user already exists, please login instead!";
            } else {

                loginDisplay();
            }
        }
    }

    async function getCurrentUser() {
        displayUpdateForm();
        const user = await (
            await fetch(
                "http://localhost:3000/users/" + sessionStorage.getItem("username"), {
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token"),
                    },
                }
            )
        ).json();
        document.getElementById("u_first_name").value = user.firstName;
        document.getElementById("u_last_name").value = user.lastName;
        document.getElementById("up_user_name_id").value = user.userName;
        document.getElementById("u_input_password").value = user.password;

    }

    async function updateUserInfo() {
        let firstName = document.getElementById("u_first_name").value;
        let lastName = document.getElementById("u_last_name").value;
        let userName = document.getElementById("up_user_name_id").value;
        let password = document.getElementById("u_input_password").value;

        if (!(
                firstName === "" ||
                lastName === "" ||
                userName === "" ||
                password === ""
            )) {
            await (
                await fetch(
                    "http://localhost:3000/users/" + sessionStorage.getItem("username"), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + sessionStorage.getItem("token"),
                        },
                        body: JSON.stringify({
                            firstName: firstName,
                            lastName: lastName,
                            userName: userName,
                            password: password

                        }),
                    }
                )
            ).json();
            loginDisplay();
        }
    }

}

main();