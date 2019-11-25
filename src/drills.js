require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function getAllItemsText(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

getAllItemsText('fish');

function getItemsPaginated(pageNumber) {
    const productsPerPage = 6
    offset = productsPerPage * (pageNumber - 1)
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

getItemsPaginated(2);

function getItemsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price','date_added','checked', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

getItemsAddedAfterDate(30);

function getTotalCost() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .orderBy([
            {column: 'category', order: 'ASC'}
        ])
        .then(result => {
            console.log(result)
        })
}

getTotalCost();