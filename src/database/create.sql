select 'create database dev'
where not exists (select from pg_database where datname = 'dev') \gexec

\c dev

create table if not exists posts (
    id int primary key generated always as identity,
    content varchar(1024)
);