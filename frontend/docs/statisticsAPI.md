# Charts API
## Stats
`GET /stats`

Query params:
* `dateFrom` - string YYYY-MM-DD
* `dateTo` - string YYYY-MM-DD
* `sharedOnly` - boolean
Response - all data intersecting with period `dateFrom` - `dateTo`:
```js
{
  expensesInTime:{
    // X axis, ["2019-01", "2019-02", ...]
    labels: string[],
    // Datasets, one per user
    datasets:[
      {
        // Firstname + Surname
        label: string,
        // Y axis sum of all expenses made by user, [1, 2, ...]
        data: number[],
        // User color
        backgroundColor: string,
      }, ...
    ]
  },
  expensesByCategory:{
    // X axis, ["Obuwie", "Spożywcze", ...]
    labels: string[],
    // Datasets, one per user
    datasets:[
      {
        // Firstname + Surname
        label: string,
        // Bar height, sum of all expenses in category for user, [1, 2, ...]
        data: number[],
        // User color
        backgroundColor: string,
      }, ...
    ]
  },
  expensesByCategoryDoughnut:{
     // Labels, ["Obuwie", "Spożywcze", ...]
    labels: string[],
    // Dataset - only one
    datasets:[
      {
        // Real value, not percent, [1, 2, ...]
        data: number[],
        /** Categories' colors, [
          "rgba(0,0,0,0.5)",
          "rgba(255,0,0,0.5)",
          "rgba(0,0,255,0.5)"
        ] */
        backgroundColor: string[],
      }
    ]
  }
}
```