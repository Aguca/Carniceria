document.addEventListener('DOMContentLoaded', function() {
    const filterTagsContainer = document.getElementById('filterTags');
    const recipesContainer = document.getElementById('recipesContainer');
    
    // Categorías de carne disponibles en TheMealDB
    const meatCategories = [
        { id: 'beef', name: 'Carne de Res' },
        { id: 'chicken', name: 'Pollo' },
        { id: 'lamb', name: 'Cordero' },
        { id: 'pork', name: 'Cerdo' },
        { id: 'goat', name: 'Cabra' }
    ];
    
    // Mostrar etiquetas de filtro
    function renderFilterTags() {
        filterTagsContainer.innerHTML = '';
        
        // Añadir botón "Todos"
        const allTag = document.createElement('div');
        allTag.classList.add('tag', 'active');
        allTag.textContent = 'Todos';
        allTag.addEventListener('click', () => {
            document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
            allTag.classList.add('active');
            fetchRecipes();
        });
        filterTagsContainer.appendChild(allTag);
        
        // Añadir categorías de carne
        meatCategories.forEach(category => {
            const tag = document.createElement('div');
            tag.classList.add('tag');
            tag.textContent = category.name;
            tag.dataset.category = category.id;
            tag.addEventListener('click', () => {
                document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
                tag.classList.add('active');
                fetchRecipes(category.id);
            });
            filterTagsContainer.appendChild(tag);
        });
    }
    
    // Obtener recetas de la API
    async function fetchRecipes(category = null) {
        try {
            recipesContainer.innerHTML = '<p>Cargando recetas...</p>';
            
            let url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
            
            if (category) {
                url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
            } else {
                // Obtener todas las recetas de carne
                const responses = await Promise.all(
                    meatCategories.map(cat => 
                        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat.id}`)
                            .then(res => res.json())
                    )
                );
                
                // Combinar todas las recetas y eliminar duplicados
                const allMeals = responses.flatMap(res => res.meals || []);
                const uniqueMeals = Array.from(new Set(allMeals.map(meal => meal.idMeal)))
                    .map(id => allMeals.find(meal => meal.idMeal === id));
                
                renderRecipes(uniqueMeals);
                return;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.meals) {
                renderRecipes(data.meals);
            } else {
                recipesContainer.innerHTML = '<p>No se encontraron recetas para esta categoría.</p>';
            }
        } catch (error) {
            console.error('Error al obtener recetas:', error);
            recipesContainer.innerHTML = '<p>Error al cargar las recetas. Inténtalo de nuevo más tarde.</p>';
        }
    }
    
    // Mostrar recetas en el DOM
    function renderRecipes(meals) {
        recipesContainer.innerHTML = '';
        
        if (!meals || meals.length === 0) {
            recipesContainer.innerHTML = '<p>No se encontraron recetas.</p>';
            return;
        }
        
        meals.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            
            // Obtener la categoría de la receta
            const category = meatCategories.find(cat => 
                meal.strMeal.toLowerCase().includes(cat.id) || 
                (meal.strCategory && meal.strCategory.toLowerCase().includes(cat.id))
            ) || { name: 'Carne' };
            
            recipeCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image">
                <div class="recipe-content">
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                    <span class="recipe-category">${category.name}</span>
                    <div class="recipe-tags">
                        <span class="recipe-tag">${meal.strArea || 'Internacional'}</span>
                    </div>
                    <a href="https://www.themealdb.com/meal/${meal.idMeal}" target="_blank" class="recipe-link">Ver Receta</a>
                </div>
            `;
            
            recipesContainer.appendChild(recipeCard);
        });
    }
    
    // Inicializar
    renderFilterTags();
    fetchRecipes();
});