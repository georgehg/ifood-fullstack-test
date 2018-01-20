package com.ifood.demo;

import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.UUID;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ifood.demo.client.Client;
import com.ifood.demo.client.ClientRepository;

@RunWith(SpringRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = ClientApplication.class)
public class ClientRestDataTests {

	private MockMvc mockMvc;

	private HttpMessageConverter mappingJackson2HttpMessageConverter;

	private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
			MediaType.APPLICATION_JSON.getSubtype(), Charset.forName("utf8"));

	@Autowired
	private WebApplicationContext context;
	
	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	void setConverters(HttpMessageConverter<?>[] converters) {

		this.mappingJackson2HttpMessageConverter = Arrays.asList(converters).stream()
				.filter(hmc -> hmc instanceof MappingJackson2HttpMessageConverter).findAny().orElse(null);

		assertNotNull("the JSON message converter must not be null", this.mappingJackson2HttpMessageConverter);

	}

	private String json(Object o) throws IOException {
		MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
		this.mappingJackson2HttpMessageConverter.write(o, MediaType.APPLICATION_JSON, mockHttpOutputMessage);
		return mockHttpOutputMessage.getBodyAsString();
	}

	public static <T> Object jsonToObject(String json, Class<T> objectClass) throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.readValue(json, objectClass);
	}
	
	public static String jsonPathValue(String json, String fieldPath) throws IOException {
		JsonNode treeNode = new ObjectMapper().readTree(json);
		for (String field : fieldPath.split("\\.")) {
			if (treeNode.has(field)) {
				treeNode = treeNode.get(field);
			} else {
				return "";
			}		
		}
		return treeNode.textValue();
	}

	@Before
	public void setup() throws Exception {

		this.mockMvc = MockMvcBuilders.webAppContextSetup(this.context).alwaysDo(MockMvcResultHandlers.print()).build();
	}
	
	@After
	public void truncateTable() {
		clientRepository.deleteAll();
	}

	@Test
	public void contextLoadsTest() {}

	@Test
	public void hateoasApiTest() throws Exception {
		
		String apiContent = this.mockMvc.perform(get("/v1/").contextPath("/v1"))
							.andExpect(status().isOk())
							.andExpect(jsonPath("_links", hasKey("clients")))
							.andExpect(jsonPath("_links.clients.href", is("http://localhost/v1/clients")))
							.andReturn().getResponse().getContentAsString();
		
		String clientsUrl = jsonPathValue(apiContent, "_links.clients.href")
							.replace("http://localhost","");
		
		String clientsContent = this.mockMvc.perform(get(clientsUrl).contextPath("/v1"))
								.andExpect(status().isOk())
								.andExpect(jsonPath("_links", hasKey("self")))
								.andExpect(jsonPath("_links", hasKey("search")))
								.andExpect(jsonPath("_links.self.href", is("http://localhost/v1/clients")))
								.andExpect(jsonPath("_links.search.href", is("http://localhost/v1/clients/search")))
								.andReturn().getResponse().getContentAsString();
		
		String searchUrl = jsonPathValue(clientsContent, "_links.search.href")
							.replace("http://localhost","");
		
		this.mockMvc.perform(get(searchUrl).contextPath("/v1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("_links", hasKey("byName")))
			.andExpect(jsonPath("_links", hasKey("byPhone")))
			.andExpect(jsonPath("_links", hasKey("byEmail")))
			.andExpect(jsonPath("_links", hasKey("byNameAndPhone")))
			.andExpect(jsonPath("_links.self.href", is("http://localhost/v1/clients/search")))
			.andExpect(jsonPath("_links.byName.href", is("http://localhost/v1/clients/search/byName{?name}")))
			.andExpect(jsonPath("_links.byPhone.href", is("http://localhost/v1/clients/search/byPhone{?phone}")))
			.andExpect(jsonPath("_links.byEmail.href", is("http://localhost/v1/clients/search/byEmail{?email}")))
			.andExpect(jsonPath("_links.byNameAndPhone.href", is("http://localhost/v1/clients/search/byNameAndPhone{?name,phone}")))
			.andReturn().getResponse().getContentAsString();
	}

	@Test
	public void createClientTest() throws Exception {

		Client newClient = new Client("João da Silva", "joao@silva.com", "12345678");
		
		String apiContent = this.mockMvc.perform(get("/v1/").contextPath("/v1"))
							.andReturn().getResponse().getContentAsString();
		
		String clientsUrl = jsonPathValue(apiContent, "_links.clients.href")
							.replace("http://localhost","");

		String clientId = this.mockMvc.perform(post(clientsUrl).contextPath("/v1")
							.contentType(contentType).content(json(newClient)))
							.andExpect(status().isCreated())
							.andReturn().getResponse().getHeader("Location").split("/clients/")[1];

		this.mockMvc.perform(get(clientsUrl + "/{clientId}", clientId).contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("name", is(newClient.getName())))
					.andExpect(jsonPath("email", is(newClient.getEmail())))
					.andExpect(jsonPath("phone", is(newClient.getPhone())))
					.andExpect(jsonPath("_links", hasKey("self")))
					.andExpect(jsonPath("_links.self.href", is("http://localhost/v1/clients/" + clientId)));
	}

	@Test
	public void updateClientTest() throws Exception {

		Client newClient = new Client("Maria da Silva", "maria@silva.com", "12348765");
		
		String apiContent = this.mockMvc.perform(get("/v1/").contextPath("/v1"))
							.andReturn().getResponse().getContentAsString();
		
		String clientsUrl = jsonPathValue(apiContent, "_links.clients.href")
							.replace("http://localhost","");

		String clientId = this.mockMvc.perform(post(clientsUrl).contextPath("/v1")
							.contentType(contentType).content(json(newClient)))
							.andExpect(status().isCreated())
							.andReturn().getResponse().getHeader("Location").split("/clients/")[1];

		String createdClientJson = this.mockMvc.perform(get(clientsUrl + "/{clientId}", clientId).contextPath("/v1"))
								.andExpect(status().isOk())
								.andExpect(jsonPath("name", is(newClient.getName())))
								.andExpect(jsonPath("email", is(newClient.getEmail())))
								.andExpect(jsonPath("phone", is(newClient.getPhone())))
								.andExpect(jsonPath("_links", hasKey("self")))
								.andExpect(jsonPath("_links.self.href", is("http://localhost/v1/clients/" + clientId)))
								.andReturn().getResponse().getContentAsString();

		Client createdClient = (Client) jsonToObject(createdClientJson, Client.class);
		Client clientForUpdate = new Client(createdClient.getName(), createdClient.getEmail(), "99998888");
		clientForUpdate.setId(UUID.fromString(clientId));

		this.mockMvc.perform(put(clientsUrl + "/{clientId}", clientId).contextPath("/v1")
					.contentType(contentType).content(json(clientForUpdate)))
					.andExpect(status().isNoContent());
		
		this.mockMvc.perform(get(clientsUrl + "/{clientId}", clientId).contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("name", is(clientForUpdate.getName())))
					.andExpect(jsonPath("email", is(clientForUpdate.getEmail())))
					.andExpect(jsonPath("phone", is(clientForUpdate.getPhone())))
					.andExpect(jsonPath("_links", hasKey("self")))
					.andExpect(jsonPath("_links.self.href", is("http://localhost/v1/clients/" + clientId)))
					.andReturn().getResponse().getContentAsString();
	}
	
	@Test
	public void searchClientTest() throws Exception {
		
		Client client1 = new Client("João da Silva", "joao@silva.com", "12345678");
		Client client2 = new Client("José da Silva", "jose@silva.com", "987654321");
		Client client3 = new Client("Maria da Silva", "maria@silva.com", "12348765");
		
		String apiContent = this.mockMvc.perform(get("/v1/").contextPath("/v1"))
								.andReturn().getResponse().getContentAsString();
		
		String clientsUrl = jsonPathValue(apiContent, "_links.clients.href")
								.replace("http://localhost","");
		
		String clientsContent = this.mockMvc.perform(get(clientsUrl).contextPath("/v1"))
								.andReturn().getResponse().getContentAsString();
			
		String searchUrl = jsonPathValue(clientsContent, "_links.search.href")
								.replace("http://localhost","");
		
		String searchContent = this.mockMvc.perform(get(searchUrl).contextPath("/v1"))
								.andReturn().getResponse().getContentAsString();
		
		String searchByNameUrl = buildSearchUrl(searchContent, "_links.byName.href");
		String searchByEmailUrl = buildSearchUrl(searchContent, "_links.byEmail.href");
		String searchByPhoneUrl = buildSearchUrl(searchContent, "_links.byPhone.href");
		String searchByNameAndPhoneUrl = buildSearchUrl(searchContent, "_links.byNameAndPhone.href");
		
		this.mockMvc.perform(post(clientsUrl).contextPath("/v1").contentType(contentType).content(json(client1))).andExpect(status().isCreated());
		this.mockMvc.perform(post(clientsUrl).contextPath("/v1").contentType(contentType).content(json(client2))).andExpect(status().isCreated());
		this.mockMvc.perform(post(clientsUrl).contextPath("/v1").contentType(contentType).content(json(client3))).andExpect(status().isCreated());
		
		this.mockMvc.perform(get(searchByNameUrl, "Silva").contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("_embedded.clients", hasSize(3)));
		
		this.mockMvc.perform(get(searchByNameUrl, client1.getName()).contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("_embedded.clients", hasSize(1)))
					.andExpect(jsonPath("_embedded.clients[0].name", is(client1.getName())))
					.andExpect(jsonPath("_embedded.clients[0].email", is(client1.getEmail())))
					.andExpect(jsonPath("_embedded.clients[0].phone", is(client1.getPhone())));
		
		this.mockMvc.perform(get(searchByEmailUrl, client2.getEmail()).contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("_embedded.clients", hasSize(1)))
					.andExpect(jsonPath("_embedded.clients[0].name", is(client2.getName())))
					.andExpect(jsonPath("_embedded.clients[0].email", is(client2.getEmail())))
					.andExpect(jsonPath("_embedded.clients[0].phone", is(client2.getPhone())));
		
		this.mockMvc.perform(get(searchByPhoneUrl, client3.getPhone()).contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("_embedded.clients", hasSize(1)))
					.andExpect(jsonPath("_embedded.clients[0].name", is(client3.getName())))
					.andExpect(jsonPath("_embedded.clients[0].email", is(client3.getEmail())))
					.andExpect(jsonPath("_embedded.clients[0].phone", is(client3.getPhone())));
		
		this.mockMvc.perform(get(searchByNameAndPhoneUrl, "Silva", "4321").contextPath("/v1"))
					.andExpect(status().isOk())
					.andExpect(jsonPath("_embedded.clients", hasSize(1)))
					.andExpect(jsonPath("_embedded.clients[0].name", is(client2.getName())))
					.andExpect(jsonPath("_embedded.clients[0].email", is(client2.getEmail())))
					.andExpect(jsonPath("_embedded.clients[0].phone", is(client2.getPhone())));
	}
	
	private String buildSearchUrl(String searchContent, String jsonPath ) throws IOException {
		
		String jsonValue = jsonPathValue(searchContent, jsonPath);
		String searchUrl = jsonValue.replace("http://localhost", "").split("\\?")[0].replace("{", "?");
		String[] searchParams = jsonValue.split("\\?")[1].split(",|}");
		
		for (String param : searchParams) {
			searchUrl += param + "={" + param + "}&";
		}
		
		return searchUrl;
	}

}
