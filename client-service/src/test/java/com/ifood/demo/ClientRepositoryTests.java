package com.ifood.demo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.ifood.demo.client.Client;
import com.ifood.demo.client.ClientRepository;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientRepositoryTests {

	@Autowired
	private ClientRepository clientRepository;

	@Before
	public void insertClients() {
		clientRepository.save(new Client("João da Silva", "joao@silva.com", "12345678"));
		clientRepository.save(new Client("Maria da Silva", "maria@silva.com", "12348765"));
		clientRepository.save(new Client("José da Silva", "jose@silva.com", "987654321"));
	}
	
	@After
	public void truncateTable() {
		clientRepository.deleteAll();
	}

	@Test
	public void contextLoadsTest() {
		assertThat(clientRepository).isNotNull();
	}

	@Test
	public void saveClientTest() {

		Client newClient = new Client("Antonio Roberto", "antonio@roberto.com", "11112345");
		clientRepository.save(newClient);

		Client clientFound = clientRepository.findOne(newClient.getId());
		assertThat(clientFound).isEqualTo(newClient);
	}

	@Test
	public void findClientByName() {

		Optional<Client> clientFound = clientRepository.findByNameIgnoreCaseContaining("João da Silva").stream().findFirst();
		assertThat(clientFound.isPresent()).isTrue();

	}
	
	@Test
	public void findClientByEmail() {

		Optional<Client> clientFound = clientRepository.findByEmailIgnoreCaseContaining("maria@silva.com").stream().findFirst();
		assertThat(clientFound.isPresent()).isTrue();

	}
	
	@Test
	public void findClientByPhone() {

		Optional<Client> clientFound = clientRepository.findByPhoneIgnoreCaseContaining("987654321").stream().findFirst();
		assertThat(clientFound.isPresent()).isTrue();
	
	}
	@Test
	public void updateClientTest() {
		
		Client newClient = new Client("Fernando Souza", "fernando@souza.com", "88889999");
		clientRepository.save(newClient);

		Client clientFound = clientRepository.findOne(newClient.getId());
		Client clientForUpdate = new Client("Fernando Silva", "fernando@souza.com", clientFound.getPhone());
		clientForUpdate.setId(clientFound.getId());
		Client clientUpdated = clientRepository.save(clientForUpdate);
		
		assertThat(clientUpdated.getId()).isEqualTo(newClient.getId());
		assertThat(clientUpdated).isNotEqualTo(newClient);
		assertThat(clientUpdated).isEqualTo(clientForUpdate);
	}

}
