package com.ifood.demo.order;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.format.annotation.DateTimeFormat;

public interface OrderRepository extends PagingAndSortingRepository<Order, UUID> {

	@RestResource(path = "byClientId", rel = "byClientId")
	Collection<Order> findByClientId(@Param("clientId") UUID clientId);
	
	@RestResource(path = "byRestaurantId", rel = "byRestaurantId")
	Collection<Order> findByRestaurantId(@Param("restaurantId") UUID restaurantId);
	
	@RestResource(path = "byDate", rel = "byDate")
	Collection<Order> findByCreatedAtBetween(@Param("start") @DateTimeFormat(pattern="yyyy-MM-dd") Date start, @Param("end") @DateTimeFormat(pattern="yyyy-MM-dd") Date end);
	
	@RestResource(path = "byClientIdAndDate", rel = "byClientIdAndDate")
	Collection<Order> findByClientIdAndCreatedAtBetween(@Param("clientId") UUID clientId, @Param("start") @DateTimeFormat(pattern="yyyy-MM-dd") Date start, @Param("end") @DateTimeFormat(pattern="yyyy-MM-dd") Date end);
	
}