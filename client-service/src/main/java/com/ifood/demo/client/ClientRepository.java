package com.ifood.demo.client;

import java.util.Collection;
import java.util.UUID;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

public interface ClientRepository extends PagingAndSortingRepository<Client, UUID> {

	@RestResource(path = "byName", rel = "byName")
	Collection<Client> findByNameIgnoreCaseContaining(@Param("name") String name);
	
	@RestResource(path = "byPhone", rel = "byPhone")
	Collection<Client> findByPhoneIgnoreCaseContaining(@Param("phone") String phone);
	
	@RestResource(path = "byEmail", rel = "byEmail")
	Collection<Client> findByEmailIgnoreCaseContaining(@Param("email") String email);
	
	@RestResource(path = "byNameAndPhone", rel = "byNameAndPhone")
	Collection<Client> findByNameIgnoreCaseContainingAndPhoneIgnoreCaseContaining(@Param("name") String name, @Param("phone") String phone);
	
	@RestResource(path = "byNameAndEmail", rel = "byNameAndEmail")
	Collection<Client> findByNameIgnoreCaseContainingAndEmailIgnoreCaseContaining(@Param("name") String name, @Param("email") String email);
	
	@RestResource(path = "byPhoneAndEmail", rel = "byPhoneAndEmail")
	Collection<Client> findByPhoneIgnoreCaseContainingAndEmailIgnoreCaseContaining(@Param("phone") String phone, @Param("email") String email);
	
	@RestResource(path = "byNameAndPhoneAndEmail", rel = "byNameAndPhoneAndEmail")
	Collection<Client> findByNameIgnoreCaseContainingAndPhoneIgnoreCaseContainingAndEmailIgnoreCaseContaining(@Param("name") String name, @Param("phone") String phone, @Param("email") String email);
	
}