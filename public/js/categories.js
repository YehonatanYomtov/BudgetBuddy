document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('addCategoryForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const addCategoryErrorElement = document.getElementById('addCategoryError');
        const categoryName = document.getElementById('categoryName').value;
        const user_id = document.querySelector('input[name="user_id"]').value;
        const formData = {
            name: categoryName,
            user_id,
        }
        fetch('/categories',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data =>{
            if(data.success){
                addCategoryErrorElement.style.display = 'none';
                const newCategory = data.category[0];
                console.log(newCategory);
                const categoriesList = document.getElementById('categoriesList');
                const categoryLi = document.createElement('li');
                categoryLi.id = `category-${newCategory.id}`;
                categoryLi.innerHTML= `
                    <button class="delete-btn" data-id="${newCategory.id}" user-id="${newCategory.user_id}">x</button> 
                    ${newCategory.name}
                `
                categoriesList.appendChild(categoryLi);
            }else{
                addCategoryErrorElement.innerText = 'Category addition failed. Category already exists.';
                addCategoryErrorElement.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error adding transaction:', error);
        });

    });

        // Event delegation for delete buttons
        document.getElementById('categoriesList').addEventListener('click', async function(event){
            if(event.target.classList.contains('delete-btn')){
                const categoryId = event.target.getAttribute('data-id');

                try{
                    const response = await axios.post(`/categories/delete/${categoryId}`);
                    if (response.data.success){
                        document.getElementById(`category-${categoryId}`).remove();
                    }
                }
                catch(err){
                    console.error('Error deleting category:', err);
                }
            }
        })

});
