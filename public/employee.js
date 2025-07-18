//Load employee data
        window.onload = loadEmployeeData;
        let data = [];
        
        async function loadEmployeeData() {
            try {
                const response = await fetch("/api/Employee");
                
                const tableBody = document.querySelector("#employee-table tbody");
                data = await response.json();
                tableBody.innerHTML = "";

                data.forEach((employee) => {
                    const row = `<tr>
                            <td>${employee.Id}</td>
                            <td>${employee.Name}</td>
                            <td>${employee.Salary}</td>
                            <td>${employee.Age}</td>
                            <td>
                                <div class = "icon-box">
                                    <i class="fa-regular fa-pen-to-square edit image" onclick="openUpdateForm(${employee.Id})"></i>
                                    <i class="fa-solid fa-trash delete image" onclick="deleteEmp(${employee.Id})"></i> 
                                </div>
                            </td>
                         </tr>`;
                    tableBody.innerHTML += row;
                });
                console.log("Data Loaded");
            } catch (error) {
                console.error("Error", error);
            }
        }

    
        //show & hide add form

        function openAddForm(){
            document.getElementById("add-box").style.display = "block"

        }

        function closeAddForm(){
            document.getElementById("add-box").style.display = "none"
        }

        //add employee data

        const addForm = document.getElementById("employeeAddForm")

        addForm.addEventListener("submit", async function (event) {

        event.preventDefault()

        // const id = document.getElementById("addId").value
        const name = document.getElementById("addName").value
        const salary = document.getElementById("addSalary").value
        const age = document.getElementById("addAge").value

        const response = await fetch("/api/newEmployee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, salary, age })
        });

        const result = await response.json()
        console.log("Employee Added.", result)
        alert("Employee added succesfully!")
        addForm.reset()
        loadEmployeeData()
        closeAddForm()
        })

        //show & hide update form

        function openUpdateForm(id){
            console.log(id)
            const employee = data.find(item => item.Id === Number(id))
            console.log(employee)

            document.getElementById("update-box").style.display = "block"

            document.getElementById("upId").value = employee.Id
            document.getElementById("upName").value = employee.Name
            document.getElementById("upSalary").value = employee.Salary
            document.getElementById("upAge").value = employee.Age


        }

        function closeUpdateForm(){
            document.getElementById("update-box").style.display = "none"
        }

        //update employee data

        const updateForm = document.getElementById("employeeUpdateForm");
        //fetch update method
         updateForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const id = document.getElementById("upId").value;
            const name = document.getElementById("upName").value;
            const salary = document.getElementById("upSalary").value;
            const age = document.getElementById("upAge").value;

            console.log("id",id)

        const response = await fetch("/api/updateEmployee/"+id, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name, salary, age })
        });

        const result = await response.json()
        console.log("Updated Successfully!" + result)
        alert(`Employee with id: ${id} updated successfully`)
        updateForm.reset()
        loadEmployeeData()
        closeUpdateForm()
        })


        //delete employee by id

        const deleteEmp = async (id) => {
            console.log("id >>",id)

            //fetch api
            const response = await fetch("/api/deleteEmployee/"+id, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            })
            
            //now store the response in result variable

            const result = await response.json()
            console.log("Deleted successfully.")
            alert(`Employee with id: ${id} deleted successfully!`)
            loadEmployeeData()
        }