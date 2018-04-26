import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPCustomer} from '../../domain/VRPCustomer';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'vrp-customers-list',
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {

  displayedColumns = ['id', 'coords', 'demand', 'actions'];
  dataSource;
  editEnabled;

  constructor(private vrpService: VRPService/*, private dialogFactoryService: DialogFactoryService*/) {
    this.dataSource = new CustomersDataSource(this.vrpService.getCustomers());

    this.vrpService.getSolutions().subscribe((v) => {
      this.editEnabled = !v || v.length == 0;
    });

  }

  ngOnInit() {
  }

  deleteCustomer(customer) {
    this.vrpService.deleteCustomer(customer);
  }

  loadFixedCustomers() {
    const lines = FIXED_CUSTOMERS.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let x = lines[i];
      let y = x.split('\t');
      console.log(y);
      let c = new VRPCustomer(y[0], parseFloat(y[1].replace(',', '\.')), parseFloat(y[2].replace(',', '\.')));
      c.demand = 20;
      this.vrpService.addCustomer(c);
    }
  }

  openImportDialog() {
    //this.dialogFactoryService.showCustomerImportDialog();
  }

}

export class CustomersDataSource extends DataSource<any> {

  constructor(private customers: Observable<VRPCustomer[]>) {
    super();
  }

  connect(): Observable<VRPCustomer[]> {
    return this.customers;
  }

  disconnect() {
  }
}


let FIXED_CUSTOMERS = 'Zamostna, 84-239, Bolszewo\t54,6323657\t18,1510615\t\t\n' +
  '1 Maja, Bytów\t54,1673564\t17,4977334\t\t\n' +
  'Wojska Polskiego 49, 77-100, Bytów\t54,170438\t17,491196\t\t\n' +
  'Zwycięstwa, Bytów\t54,1794288\t17,5000923\t\t\n' +
  'Jana Pawła II, Chojnice\t53,6994919\t17,58193\t\t\n' +
  'Marszałka Józefa Piłsudskiego 38, 89-600, Chojnice\t53,7992246\t17,9753605\t\t\n' +
  'Modra 4, 89-604, Chojnice\t53,7059539\t17,576395\t\t\n' +
  'Plac Piastowski 31, 89-600, Chojnice\t53,693648\t17,5581499\t\t\n' +
  'Oliwska, 80-209, Chwaszczyno\t54,4430901\t18,407202\t\t\n' +
  'Starogardzka, Czarna Woda\t53,8444446\t18,0996618\t\t\n' +
  'Szczecinecka, Czarne\t53,693579\t16,9067174\t\t\n' +
  'Cmentarna, 89-650, Czersk\t53,7978129\t17,9811668\t\t\n' +
  'Dworcowa 23, 89-650, Czersk\t53,798585\t17,9707119\t\t\n' +
  'Jerzego z Dąbrowy 2A, 77-300, Człuchów\t53,674382\t17,3622089\t\t\n' +
  'Romualda Traugutta 11A, Człuchów\t53,6632359\t17,3526704\t\t\n' +
  'Tadeusza Kościuszki, Debrzno\t53,5368867\t17,2358268\t\t\n' +
  'Zjednoczenia 8, 76-248, Dębnica Kaszubska\t54,377737\t17,1609469\t\t\n' +
  'Bolesława Limanowskiego 15, 82-440, Dzierzgoń\t53,923278\t19,3413519\t\t\n' +
  'Aleja Grunwaldzka 100, 80-244, Gdańsk\t54,3921244\t18,5815833\t\t\n' +
  'Aleja Grunwaldzka 211, 80-266, Gdańsk\t54,3879282\t18,5904402\t\t\n' +
  'Aleja Rzeczypospolitej 33, 80-463, Gdańsk\t54,389678\t18,609837\t\t\n' +
  'Aleja Rzeczypospolitej, 80-462, Gdańsk\t54,3894239\t18,6090532\t\t\n' +
  'Aleja Rzeczypospolitej, 80-463, Gdańsk\t54,3894239\t18,6090532\t\t\n' +
  'Chłopska, 80-362, Gdańsk\t54,4193677\t18,5846495\t\t\n' +
  'Czerwony Dwór 19, 80-376, Gdańsk\t54,411718\t18,5852209\t\t\n' +
  'Dąbrowszczaków 5, 80-374, Gdańsk\t54,416333\t18,597177\t\t\n' +
  'Długie Ogrody 14, 80-762, Gdańsk\t54,347246\t18,662827\t\t\n' +
  'Generała Augusta Emila Fieldorfa 2, 80-041, Gdańsk\t54,3278564\t18,6148329\t\t\n' +
  'Generała Józefa Hallera, 80-426, Gdańsk\t54,3827229\t18,6215473\t\t\n' +
  'Ignacego Paderewskiego 7, 80-170, Gdańsk\t54,3535022\t18,6072178\t\t\n' +
  'Jabłoniowa 46, 80-175, Gdańsk\t54,3256179\t18,5488878\t\t\n' +
  'Jagiellońska 2A, 80-371, Gdańsk\t54,412672\t18,5914319\t\t\n' +
  'Jelitkowski Dwór 2, 80-365, Gdańsk\t54,4069077\t18,6142873\t\t\n' +
  'Juliusza Słowackiego 159, 80-298, Gdańsk\t54,3774417\t18,5097988\t\t\n' +
  'Karmelicka, 80-895, Gdańsk\t54,3552537\t18,6468145\t\t\n' +
  'Kartuska 332, 80-125, Gdańsk\t54,3372978\t18,5711539\t\t\n' +
  'Kartuska, Gdańsk\t54,3441609\t18,547418\t\t\n' +
  'Kłosowa 1, 80-627, Gdańsk\t54,3594536\t18,720048\t\t\n' +
  'Krzemowa, 80-078, Gdańsk\t54,3265949\t18,6227073\t\t\n' +
  'Łąkowa 35/38, 80-769, Gdańsk\t54,341608\t18,6604019\t\t\n' +
  'Meteorytowa 11, 80-299, Gdańsk\t54,4109642\t18,4851111\t\t\n' +
  'Myśliwska 102, Gdańsk\t54,3508937\t18,5561681\t\t\n' +
  'Opolska 3, 80-395, Gdańsk\t54,4039883\t18,6011655\t\t\n' +
  'Piecewska 26, 80-288, Gdańsk\t54,3595338\t18,5840568\t\t\n' +
  'Poli Gojawiczyńskiej 1, Gdańsk\t54,3598497\t18,5900288\t\t\n' +
  'Pomorska 24, 80-333, Gdańsk\t54,420208\t18,581821\t\t\n' +
  'Porębskiego, Gdańsk\t54,3219002\t18,5784289\t\t\n' +
  'Potokowa 15D, 80-293, Gdańsk\t54,370258\t18,570698\t\t\n' +
  'Rajska 2, 80-850, Gdańsk\t54,354263\t18,6506565\t\t\n' +
  'Startowa 14, 80-461, Gdańsk\t54,398503\t18,593467\t\t\n' +
  'Świętokrzyska, Gdańsk\t54,3190835\t18,5908963\t\t\n' +
  'Tytusa Chałubińskiego 27, 80-807, Gdańsk\t54,3403589\t18,6192751\t\t\n' +
  'ul. Gdańska 21 L, 80-518 Gdańsk\t54,4028347\t18,6346106\t\t\n' +
  'ul. Gdańska 21 L, Gdańsk\t54,4028347\t18,6346106\t\t\n' +
  'ul. Obrońców Wybrzeża 27, Gdańsk\t54,410812\t18,6030139\t\t\n' +
  'ul. Ossowski Zakątek 17, Gdańsk\t54,430679\t18,4798609\t\t\n' +
  'Wacława Balcerskiego 12, 80-299, Gdańsk\t54,4307574\t18,4693795\t\t\n' +
  'Warszawska 59, Gdańsk\t54,3319744\t18,5838232\t\t\n' +
  'Wielkopolska 62, 80-480, Gdańsk\t54,310267\t18,5878247\t\t\n' +
  'Wolności 8, 80-553, Gdańsk\t54,399547\t18,669344\t\t\n' +
  'Wrzosy 1, 80-618, Gdańsk\t54,3626689\t18,711027\t\t\n' +
  'Wyzwolenia 26, 80-537, Gdańsk\t54,4009864\t18,6599769\t\t\n' +
  'Zygmunta Noskowskiego 1, 80-170, Gdańsk\t54,3555168\t18,6139767\t\t\n' +
  'Admirała Józefa Unruga 5A, 81-178, Gdynia\t54,557314\t18,4789197\t\t\n' +
  'Bosmańska, Gdynia\t54,5490229\t18,5322015\t\t\n' +
  'Chylońska 126, 81-061, Gdynia\t54,5452131\t18,4612149\t\t\n' +
  'Chylońska 251, 81-007, Gdynia\t54,5481384\t18,4417471\t\t\n' +
  'Chylońska 42, 81-041, Gdynia\t54,540416\t18,478354\t\t\n' +
  'Gniewska 2, 81-054, Gdynia\t54,5395638\t18,4718375\t\t\n' +
  'Jarosława Iwaszkiewicza 1, 81-571, Gdynia\t54,4735484\t18,4912815\t\t\n' +
  'Komandora Bolesława Romanowskiego 4, 81-198, Gdynia\t54,5623866\t18,4873745\t\t\n' +
  'Korzenna 19, 81-587, Gdynia\t54,470079\t18,501262\t\t\n' +
  'Legionów 112, 81-472, Gdynia\t54,4912397\t18,5425955\t\t\n' +
  'majora Henryka Sucharskiego 2, 81-157, Gdynia\t54,5589446\t18,5086861\t\t\n' +
  'Morska, 81-006, Gdynia\t54,526062\t18,5127849\t\t\n' +
  'Plac Kaszubski 15, 81-352, Gdynia\t54,522443\t18,5434999\t\t\n' +
  'Pułkownika Stanisława Dąbka 193, Gdynia\t54,5546952\t18,5228021\t\t\n' +
  'Rymarska, 81-179, Gdynia\t54,5508782\t18,5134254\t\t\n' +
  'Sojowa 35, 81-591, Gdynia\t54,4694283\t18,4685986\t\t\n' +
  'Świętojańska, 81-390, Gdynia\t54,512464\t18,5396723\t\t\n' +
  'Wiczlińska 45A, 81-578, Gdynia\t54,473669\t18,4659261\t\t\n' +
  'Wiczlińska 67, Gdynia\t54,482236\t18,4365959\t\t\n' +
  'Widna 1, 81-543, Gdynia\t54,4990107\t18,5077036\t\t\n' +
  'Wzgórze Bernadowo 304, 81-583, Gdynia\t54,470484\t18,51484\t\t\n' +
  'Tadeusza Kościuszki 10, 83-140, Gniew\t53,7513659\t18,8672157\t\t\n' +
  'Adama Mickiewicza, Jastarnia\t54,7031664\t18,6644947\t\t\n' +
  'Dworcowa 14, Kartuzy\t54,333868\t18,204362\t\t\n' +
  'Os. Wybickiego 3B, Kartuzy\t54,326289\t18,195726\t\t\n' +
  'Wzgórze Wolności 1, Kartuzy\t54,333759\t18,191075\t\t\n' +
  'Generała Władysława Sikorskiego 7, 77-230, Kępice\t54,237764\t16,8907989\t\t\n' +
  'Słupska, 77-140, Kołczygłowy\t54,242228\t17,2203239\t\t\n' +
  'Kamienna 2, 83-400, Kościerzyna\t54,1241219\t17,9867848\t\t\n' +
  'Marii Skłodowskiej-Curie 34, Kościerzyna\t54,12163\t17,964525\t\t\n' +
  'Juliusza Słowackiego, Kwidzyn\t53,7288526\t18,9399871\t\t\n' +
  'Mikołaja Kopernika, Kwidzyn\t53,7322562\t18,929747\t\t\n' +
  'Warszawska 71, Kwidzyn\t53,7364832\t18,9465531\t\t\n' +
  'Armii Krajowej 34, 84-300, Lębork\t54,5414897\t17,7452619\t\t\n' +
  'Bolesława Krzywoustego, Lębork\t54,5361987\t17,7530472\t\t\n' +
  'I Armii Wojska Polskiego, Lębork\t54,5344667\t17,7440641\t\t\n' +
  'Kossaka, Lębork\t54,5519544\t17,7425094\t\t\n' +
  'Józefa Wybickiego, 83-424, Lipusz\t54,0995936\t17,7832054\t\t\n' +
  'Starogardzka, 83-240, Lubichowo\t53,8511906\t18,4052197\t\t\n' +
  'Generała Józefa Wybickiego, 83-050, Lublewo Gdańskie\t54,2704035\t18,4695311\t\t\n' +
  'ul. ul. Józefa Wilczka\t54,5808891\t18,0992972\t\t\n' +
  'Aleja Św. Jakuba 39, Łeba\t54,7490451\t17,5601432\t\t\n' +
  'Główna 2, 82-200, Malbork\t54,043184\t19,0212869\t\t\n' +
  'Henryka Sienkiewicza, 82-200, Malbork\t54,0329336\t19,0337446\t\t\n' +
  'Henryka Sucharskiego 2, 82-200, Malbork\t54,0281448\t19,0361575\t\t\n' +
  'Koszalińska, Malbork\t54,0194765\t19,0139616\t\t\n' +
  'Koszykowa 9, 82-200, Malbork\t54,0357819\t19,061137\t\t\n' +
  'Fabryczna 10, 77-200, Miastko\t54,0083614\t16,979141\t\t\n' +
  'Kazimierza Wielkiego, Miastko\t53,9866588\t16,9664854\t\t\n' +
  'Warszawska 6, 82-100, Nowy Dwór Gdański\t54,20779\t19,117896\t\t\n' +
  'Obrońców Westerplatte, Nowy Staw\t54,133876\t19,0198643\t\t\n' +
  'Rynek 3, Prabuty\t53,7591336\t19,1986536\t\t\n' +
  'Generała Stanisława Skalskiego 19, 83-000, Pruszcz Gdański\t54,2529085\t18,6488538\t\t\n' +
  'Jana Kasprowicza, Pruszcz Gdański\t54,2650196\t18,6643388\t\t\n' +
  'Księdza Józefa Waląga 1, 83-000, Pruszcz Gdański\t54,2614416\t18,6381985\t\t\n' +
  'Nowa 3, Puck\t54,7167622\t18,4050339\t\t\n' +
  'Topolowa, 84-100, Puck\t54,7092606\t18,3911562\t\t\n' +
  'Gdańska, Reda\t54,5952208\t18,354587\t\t\n' +
  'Jana Pawła II 4, Reda\t54,60239\t18,3539519\t\t\n' +
  'Obwodowa 27, 84-240, Reda\t54,5950341\t18,361583\t\t\n' +
  'Grunwaldzka 8, 84-230, Rumia\t54,573929\t18,3829561\t\t\n' +
  'Henryka Dąbrowskiego 76, 84-230, Rumia\t54,5591476\t18,423224\t\t\n' +
  'Kosynierów 55, Rumia\t54,5819041\t18,3869701\t\t\n' +
  'Starowiejska 13, 84-230, Rumia\t54,569255\t18,3909789\t\t\n' +
  'Tadeusza Kościuszki, Skarszewy\t54,1455604\t18,6005227\t\t\n' +
  'Pomorska, Skórcz\t53,7914477\t18,5135502\t\t\n' +
  '11 Listopada 11, 76-200, Słupsk\t54,4627945\t16,9886356\t\t\n' +
  'Główna, 76-219, Osada Jezierzyce\t54,4746398\t17,0274397\t\t\n' +
  'Hubalczyków, Słupsk\t54,4535311\t17,0600202\t\t\n' +
  'Hugona Kołłątaja 29A, Słupsk\t54,4694765\t17,0178643\t\t\n' +
  'Jana III Sobieskiego 5, 76-200, Słupsk\t54,467149\t17,0104249\t\t\n' +
  'Karola Kniaziewicza 32, Słupsk\t54,4638931\t17,0455031\t\t\n' +
  'Koszalińska, Słupsk\t54,4561347\t17,0030487\t\t\n' +
  'Pl. Dąbrowskiego 3, Słupsk\t54,4658933\t16,9913388\t\t\n' +
  'Stary Rynek 3, 76-200, Słupsk\t54,467068\t17,03095\t\t\n' +
  'Witolda Lutosławskiego 3, 76-200, Słupsk\t54,4624093\t17,0317683\t\t\n' +
  'Wolności 42, 76-200, Słupsk\t54,470727\t17,025811\t\t\n' +
  'Dworcowa 2A, 83-230, Czerwińsk\t53,7452925\t18,687067\t\t\n' +
  'Aleja Niepodległości 691, 81-853, Sopot\t54,432411\t18,5622549\t\t\n' +
  'Aleja Niepodległości 813/815, 81-827, Sopot\t54,445144\t18,5597918\t\t\n' +
  'Wejherowska, 81-806, Sopot\t54,4519619\t18,5558643\t\t\n' +
  'Kościerska 44, 83-430, Stara Kiszewa\t53,991827\t18,178864\t\t\n' +
  'Generała Józefa Hallera 19c, 83-200, Starogard Gdański\t53,9698045\t18,5272462\t\t\n' +
  'Ignacego Paderewskiego 6, 83-200, Starogard Gdański\t53,966101\t18,5325108\t\t\n' +
  'Skarszewska, Starogard Gdański\t53,9844195\t18,5077693\t\t\n' +
  'Zblewska 10, 83-200, Starogard Gdański\t53,9623829\t18,5092712\t\t\n' +
  'Doktora Aleksandra Majkowskiego, 83-322, Stężyca\t54,2067148\t17,9502189\t\t\n' +
  'Wejherowska, 84-220, Strzebielino-Osiedle\t54,5681542\t18,0409755\t\t\n' +
  'Adama Mickiewicza 28, 82-400, Sztum\t53,9182206\t19,0343913\t\t\n' +
  'Czerwonego Kapturka, Tczew\t54,0882515\t18,7740513\t\t\n' +
  'Kwiatowa, Tczew\t54,1035747\t18,7785955\t\t\n' +
  'Wojska Polskiego 22, Tczew\t54,090098\t18,7854639\t\t\n' +
  'Żwirki i Wigury 48, Tczew\t53,7372559\t18,9225278\t\t\n' +
  'ul. Gdańska 29\t54,326669\t19,1079799\t\t\n' +
  'Kwiatowa 1, 76-270, Ustka\t54,5727174\t16,8491991\t\t\n' +
  'Pl. Dąbrowskiego 1, Ustka\t54,5820161\t16,8665452\t\t\n' +
  'Elizy Orzeszkowej 2, 84-200, Wejherowo\t54,6040648\t18,2994214\t\t\n' +
  'Jana III Sobieskiego 241, Wejherowo\t54,6025506\t18,2325426\t\t\n' +
  'Obrońców Helu 3, Wejherowo\t54,6083474\t18,2458448\t\t\n' +
  'Osiedle Kaszubskie 46, Wejherowo\t54,6041939\t18,2570899\t\t\n' +
  'Rzeźnicka 8, 84-239\t54,6032269\t18,2438984\t\t\n' +
  'Wicko 12\t54,667533\t17,643154\t\t\n' +
  'Starowiejska 25, Władysławowo\t54,7908397\t18,4171978\t\t\n' +
  'Kościerska 2, 83-210, Zblewo\t54,794492\t18,402597\t\t\n' +
  'Książąt Pomorskich, Żukowo\t54,3509913\t18,3516658\t\t';
