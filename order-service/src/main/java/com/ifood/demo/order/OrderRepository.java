package com.ifood.demo.order;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public interface OrderRepository extends PagingAndSortingRepository<Order, UUID> {

	@RestResource(path = "byClientId", rel = "byClientId")
	Collection<Order> findByClientId(@Param("clientId") UUID clientId);
	
	@RestResource(path = "byRestaurantId", rel = "byRestaurantId")
	Collection<Order> findByRestaurantId(@Param("restaurantId") UUID restaurantId);
	
	@RestResource(path = "byDate", rel = "byDate")
	Collection<Order> findByCreatedAtBetween(@Param("start") @DateTimeFormat(iso=ISO.DATE) Date start, @Param("end") @DateTimeFormat(iso=ISO.DATE) Date end);
	
	@RestResource(path = "byClientIdAndDate", rel = "byClientIdAndDate")
	Collection<Order> findByClientIdAndCreatedAtBetween(@Param("clientId") UUID clientId, @Param("start") @DateTimeFormat(iso=ISO.DATE) Date start, @Param("end") @DateTimeFormat(iso=ISO.DATE) Date end);
	
}