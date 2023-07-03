insert into departments (name)
values ( "editorial" ), ( "design" ), ( "sales" );

insert into roles (title, salary, department_id)
values  ("editorial manager", 5000, 1),
        ("senior editor", 4000, 1),
        ("project editor", 2500, 1),
        ("editor", 1500, 1),
        ("cheif designer", 4000, 2),
        ("senior designer", 3000, 2),
        ("junior designer", 1500, 2),
        ("sales manager", 4000, 3),
        ("senior salesperson", 3000, 3),
        ("junior salesperson", 1500, 3);

insert into employees (first_name, last_name, role_id, manager_id)
values  ("Willison", "Smith", 1, null), 
        ("James", "Jones", 7, 12), 
        ("Samuel", "Taylor", 3, 1),
        ("John", "Brown", 4, 1), 
        ("George", "Davies", 10, 16), 
        ("Sam", "Evans", 9, 16),
        ("Fred", "Thomas", 4, 1), 
        ("Richard", "Roberts", 7, 12), 
        ("Bert", "Murry", 10, 16),
        ("Albert", "Lloyd", 4, 1), 
        ("David", "Jenkins", 9, 16), 
        ("Amy", "Russell", 5, null),
        ("Becky", "Harvey", 6, 12), 
        ("Beth", "Pearson", 7, 12), 
        ("Christine", "Davies", 2, 1),
        ("Emily", "Brown", 8, null), 
        ("Fanny", "Murry", 3, 1), 
        ("Holly", "White", 4, 1),
        ("Iris", "Thomas", 10, 16), 
        ("Karen", "Shepherd", 7, 12), 
        ("Pauline", "Chan", 10, 16);