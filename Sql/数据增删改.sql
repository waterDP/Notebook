# 添加数据
# 方式一 一条一条的加入数据
# 1 没有指明添加的字段

INSERT INTO emp1
VALUES (1, 'tom', '2000-12-20', 3400);

# 注意，一定要按照声明的字段的先后顺序添加
# 2 指明要添加的字段

INSERT INTO emp1(id, hire, salary, `name`)
VALUES (2, '1999-12-1', 4000, 'jerry') INSERT INTO emp1(id, `name`, salary) VALUES (3, 'jim', 5000),

                                                                                   (4, 'kimg', 23000);

# 方式二 将查询结果插入到表中

INSERT INTO emp1(id, `name`, salary, hire_date)
SELECT employee_id, last_name, salary, hire_date
FROM dempartment_id IN (50, 60) # 更新数据
# update ... set ... where ...

UPDATE emp1
SET hire_date = curdate()
WHERE id = 5
    UPDATE emp1
    SET hire_date = curdate(), salary = 6000 WHERE id = 4 # 3. 删除数据 delete from ... where ...

    DELETE
    FROM emp1 WHERE id = 1 # 小结 DML操作默认情况下，执行完成以后都会自动提交数据
 # 如果希望执行完成以后不自动提交数据，则需要使用 set autocommit = FALSE
 # mysql8 新特性 计算列

    CREATE TABLE test1(a int, b int, c int GENERATED always AS (a + b) virtual)
    INSERT INTO test1(a, b)
VALUES(10, 20)
SELECT *
FROM test1
UPDATE test1
SET a = 100