## Table of Contents

| Contents                                |          Description           |
| :-------------------------------------- | :----------------------------: |
| [basic-setup](#basic-setup)             |     basic setup ng backend     |
| [api-testing](#api-testing)             |      pano itest yung API       |
| [database-schema](#database-schema)     |        database schema         |
| [how-to-contribute](#how-to-contribute) |          contribution          |
| [schema](#schema)                       |     pano gumawa ng schema      |
| [associations](#associations)           | pano maglagay ng relationships |
| [controllers](#controllers)             |   pano gumawa ng controller    |
| [routes](#routes)                       |     pano gumawa ng routes      |
| [seeders](#seeders)                     |     pano gumawa ng seeders     |

# BASIC SETUP

1. Install mo mysql
2. Create ka ng database, yung name dapat shydan
3. CREATE database shydan;
4. Punta ka sa backend na folder tapos type `npm install`
5. Create ka ng .env file dito sa backend folder (Make sure naka cd backend ka)
6. Ilagay mo to sa .env

```env
DATABASE_URL="mysql://username:password@localhost:3306/shydan"
```

Wag mo kalimutan iedit yung username,password,host ng mysql mo (IMPORTANT! kung nagkakaroon ka ng access denied, gawa ka nalang ng new account sa mysql)

8. `npm run dev`
9. `npx prisma migrate dev --name init `(i run mo tong command para sa migration ng database, yung init kahit ano lang yan depende sa gusto mo iname sa migration)
10. `npx prisma db seed`

# API TESTING

1. Install ka postman
2. Create ka ng new HTTP request
3. nasa localhost:3001/ yung mga api
4. tignan mo sa routes directory yung mga endpoints

---

# DATABASE SCHEMA

Under construction...

---

# HOW TO CONTRIBUTE

1. Gawa ka muna new branch based sa staging branch

```bash
   cd backend
   git checkout staging
   git pull origin staging
   git checkout -b "name-ng-feature-na-ginagawa-mo"
```

3. Gawa ka ng schema sa [`prisma/schema.prisma`](./prisma/schema.prisma) (Check mo nalang yung docs dito sa prisma schema)
   [https://www.prisma.io/docs/concepts/components/prisma-schema]()

   [https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#native-type-mapping]()

4. Gawa ka ng controller (e.g. UserController.ts)
5. Gawa ka ng route (e.g. users.ts)
6. After mo matapos yung working feature na ginagawa mo, gawin mo to para updated sa dev branch yung ginagawa mong branch

```bash
   git add .
   git commit -m "yung-description ng ginawa mo"
   #bago mo i push make sure na updated dev branch mo
   git checkout staging
   git pull origin staging
   git checkout "name-ng-branch-na-pinagtrabahuan-mo-kanina"
   git merge staging
```

7. Itest mo ulit yung code mo kung gumagana parin, kung may error ifix mo muna bago mo ipush tsaka ayusin mo din yung mga conflict (Kung di mo kaya maayos, pwede ka magtanong sa team)
8. After mo mafix yung error, pwede mo na ipush

```bash
   git add .
   git commit -m "yung-description ng ginawa mo"
   git push -u origin "yung-name-ng-branch-na-pinagtrabahuan-mo"
```

9. After nyan, punta ka sa github tapos submit ka pull request sa dev or sa branch na gusto mo ichange

# SCHEMA

--Ito yung table sa database

1. Punta ka sa primsa/schema.prisma
2. Nandito yung documentation sa pag gawa ng model [https://www.prisma.io/docs/concepts/components/prisma-schema]()

   [https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#native-type-mapping]()

3. Pwede mo naman din icopy paste nalang yung nagawa kong schema (ichange mo lang yung name)
4. After nyan mag migrate ka `npx prisma migrate dev --name name-ng-migration-mo`

# ASSOCIATIONS

1. Punta ka sa primsa/schema.prisma
2. Nandito ang docs sa sequelize assoc - [https://www.prisma.io/docs/concepts/components/prisma-schema/relationshttps://sequelize.org/master/manual/assocs.htm]()
3. After nyan mag migrate ka `npx prisma migrate dev --name name-ng-migration-mo`

# CONTROLLERS

-- Controller yung responsible sa pag query sa database

-- Ito yung mga function para makuha natin yung data sa database

1. Punta ka sa /src/controllers
2. Nandito yung documentation sa pag query https://www.prisma.io/docs/concepts/components/prisma-client/crudhttps://sequelize.org/master/manual/model-querying-basics.htm
3. Ito pa https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries
4. Yung name ng controller dapat uppercase kasi class (convention lang) tapos yung name ng gusto mong gawin, e.g. ItemController.ts

# ROUTES

-- Ito yung ilalagay niyo sa postman

-- Ito yung gagamitin ng frontend para maaccess yung api natin

-- Ito yung mga endpoints, yung URL

1. Punta ka sa src/routes
2. Copy paste mo lang yung mga sample ko diyan, tas ibahin mo nalang yung name e.g. employees.js
3. Ibahin mo din yung controller na inimport based sa kung anong controller gagamitin mo para sa route na yan
4. Ito documentation sa routing https://expressjs.com/en/guide/routing.html
5. Make sure na ifofollow mo to sa REST API (Mga guidelines/rules lang to pag gumagawa ka ng routes) ![image](https://usercontent.one/wp/www.kennethlange.com/wp-content/uploads/2018/10/task_api.png?media=1631958963)
6. After mo magcreate ng route, iregister mo siya
7. Punta ka lang sa src/routes/index.js tapos iimport mo yung route tapos mag routes.use ka
8. E.g. `routes.use("/items", items); `

---

# SEEDERS

**OPTIONAL**

-- Yung seeds ay yung mga iniinsert natin kaagad sa database para may laman na siya agad.

-- Magcecreate kalang ng seeds kung kailangan mo may laman kaagad yung database

1. Punta ka sa prisma/seed.ts
2. Nandito yung documentation sa pag gawa ng seeds https://www.prisma.io/docs/guides/database/seed-databasehttps://sequelize.org/master/manual/migrations.htm
3. Ito din https://daily-dev-tips.com/posts/seeding-a-prisma-database-in-nextjs/
4. Check mo nalang din yung first sample seed ko.
