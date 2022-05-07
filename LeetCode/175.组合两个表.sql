SELECT p.firstName, p.lastname, d.city, d.state
FROM Person p LEFT JOIN `Address` d
ON p.personId = d.personId;