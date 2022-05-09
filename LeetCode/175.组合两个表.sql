select p.firstName, p.lastname, d.city, d.state
from Person p left join `Address` d
on p.personId = d.personId;