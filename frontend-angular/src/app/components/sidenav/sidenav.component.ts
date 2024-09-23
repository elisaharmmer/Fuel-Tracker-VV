import { Component } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  navItems: NavItem[] = [
    { label: 'Lista de Postos', icon: 'table', route: '/postos' },
    { label: 'Gráficos de Preços', icon: 'ssid_chart', route: '/graficos' },
    { label: 'Contato', icon: 'connect_without_contact', route: '/contato' },
    { label: 'Sobre', icon: 'contact_support', route: '/sobre' }
  ];
}
