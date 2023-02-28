import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './hotelUserTable.css';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ApiCapUser } from '../../services/apiCapRegister/apiCapRegister';
import { GetUserDetailsApi } from '../../services/UserService/UserService';
import { DeleteUserApi } from '../../services/UserService/UserService';
import { UserService } from '../../services/UserService/UserService';
import { DeleteCabUserApi } from '../../services/apiCapRegister/apiCapRegister';
import { UpdateCabUserApi } from '../../services/apiCapRegister/apiCapRegister';
import { DeleteMultipleCabUserApi } from '../../services/apiCapRegister/apiCapRegister';
import { CabService } from '../../services/apiCapRegister/apiCapRegister';
import 'primeicons/primeicons.css';
import { DeleteMultipleUserApi } from '../../services/UserService/UserService';
import { UpdateUserApi } from '../../services/UserService/UserService';
import { elementAcceptingRef } from '@mui/utils';
import Context from '../../services/Context/Context';
import { getHotelDetails } from '../../services/Api.Hotel.Service/Api.Hotel.Service';
import { registerHotel } from '../../services/Api.Hotel.Service/Api.Hotel.Service';
import { updateHotelDetails } from '../../services/Api.Hotel.Service/Api.Hotel.Service';
import { deleteHotel } from '../../services/Api.Hotel.Service/Api.Hotel.Service';

import axios from 'axios';
const HotelUserTable = () => {
    let emptyProduct = {
        _id: '',
        name: '',
        email: '',
        status: null,
        mobileNo: '',
        gender: null,
    };
    let emptyData = {
        hotelName: '',
        location: '',
        hotelNumber: '',
        amenitiesList: [],
        roomsList: [],
    };
    const amenitiesData = [
        "Free Wifi", "Attached Bathroon", "Breakfast", "Power Backup", "TV", "AC", "CCTV Cameras", "Parking Facilty", 'Swimming Pool', "Spa", "Lift", "Restaurant", "Bar", 'Indoor Games', "Outdoor Sports",
        'Terrace', 'Room Service'
    ]
    const [products, setProducts] = useState(null);
    const [hotelDatas, sethotelDatas] = useState(null)
    const [loads, setLoad] = useState(false)
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [eachHotelDetail, setEachHotelDetail] = useState(emptyData)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [fromLocationList, setFromLocationList] = useState([])
    const [toLocationList, setToLocationList] = useState([])
    const [fromlocation, setFromlocation] = useState("")
    const [toLocation, setToLocation] = useState("")
    const [show_from_address, setshow_from_address] = useState(Boolean)
    const [show_to_address, setshow_to_address] = useState(Boolean)
    const [ACfromlocation, setACfromlocation] = useState([]);
    const [ACtolocation, setACtolocation] = useState([]);
    const [showAcCharges, setShowAcCharges] = useState(false)
    const [amenitiesList, setamenitiesList] = useState([])
    const [amenities, setamenities] = useState((null))
    const [location, setLocation] = useState((null))
    const [deluxeRooms, setDeluxeRooms] = useState(null)
    const [nonDeluxeRooms, setNonDeluxeRooms] = useState(null)
    const [familyRooms, setFamilyRooms] = useState()
    const [tripleRooms, setTripleRooms] = useState()
    const [suiteRooms, setSuiteRooms] = useState()
    const [pricePerDayDeluxe, setPricePerDayDeluxe] = useState((null))
    const [adultDeluxe, setAdultDeluxe] = useState((null))
    const [childDeluxe, setChildDeluxe] = useState((null))
    const [sqftDeluxe, setSqftDeluxe] = useState((null))
    const [pricePerDayNonDeluxe, setPricePerDayNonDeluxe] = useState((null))
    const [adultNonDeluxe, setAdultNonDeluxe] = useState((null))
    const [childNonDeluxe, setChildNonDeluxe] = useState((null))
    const [sqftNonDeluxe, setSqftNonDeluxe] = useState((null))
    const [pricePerDaySuite, setPricePerDaySuite] = useState((null))
    const [adultSuite, setAdultSuite] = useState((null))
    const [childSuite, setChildSuite] = useState((null))
    const [sqftSuite, setSqftSuite] = useState((null))
    const [pricePerDayFamily, setPricePerDayFamily] = useState((null))
    const [adultFamily, setAdultFamily] = useState((null))
    const [childFamily, setChildFamily] = useState((null))
    const [sqftFamily, setSqftFamily] = useState((null))
    const [pricePerDayTriple, setPricePerDayTriple] = useState((null))
    const [adultTriple, setAdultTriple] = useState((null))
    const [childTriple, setChildTriple] = useState((null))
    const [sqftTriple, setSqftTriple] = useState((null))

  
    useEffect(() => {
        getHotelDetails().then(res => {
          
            const data = res.data.hotelUserData
            const hotelData = res.data.hotelData
            const userData = data.reverse()
            setProducts(userData)
            sethotelDatas(hotelData)
        })
        setLoad(true)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const fromvalue = async (data) => {
        setFromlocation(data)
        const request = await axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' + fromlocation + '&+category=&outFields=*&forStorage=false&f=pjson')
        setACfromlocation(request.data.candidates)
        setshow_from_address(true);
    }
    const getFromlocation = (data) => {
        
        setamenitiesList([...amenitiesList, data])
    }
    const formatCurrency = (value) => {
        return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }
    const openNew = () => {
        setProduct(emptyProduct);
        setEachHotelDetail(emptyData)
        setamenitiesList([])
        setSubmitted(false);
        setProductDialog(true);
        setShowAcCharges(false)
        setLocation('')
    }
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }
    const saveProduct = () => {
        // setSubmitted(true);
        let _products = [...products];
        let _hotelDatas = [...hotelDatas]
        let _product = { ...product };
        let _eachHotelDetail = { ...eachHotelDetail }
        const index = findIndexById(product.hotelId);
        const cabIndex = findIndexByIdCab(eachHotelDetail.hotelId)
        // _products[index] = _product;
        // _hotelDatas[cabIndex] = _eachHotelDetail
        const isUpdated = products.filter(each => each._id === _product._id)
        const isUpdatedCab = hotelDatas.filter(each => each._id === eachHotelDetail._id)

        
        if (isUpdated.length === 0 || isUpdatedCab.length === 0) {
            const personalDetails = {
                name: product.name,
                email: product.email,
                availableStatus: product.availableStatus,
                mobileNo: product.mobileNo,
                gender: product.gender,
            }
            const roomsList = {
                deluxeRooms: { rooms: deluxeRooms, price: pricePerDayDeluxe, adult: adultDeluxe, child: childDeluxe, type: 'Deluxe Room', sqftDeluxe },
                nonDeluxeRooms: { rooms: nonDeluxeRooms, price: pricePerDayNonDeluxe, adult: adultNonDeluxe, child: childNonDeluxe, type: 'Non-Deluxe Room', sqftNonDeluxe },
                suiteRooms: { rooms: suiteRooms, price: pricePerDaySuite, adult: adultSuite, child: childSuite, type: 'Suite Room', sqftSuite },
                familyRooms: { rooms: familyRooms, price: pricePerDayFamily, adult: adultFamily, child: childFamily, type: 'Family Room', sqftFamily },
                tripleRooms: { rooms: tripleRooms, price: pricePerDayTriple, adult: adultTriple, child: childTriple, type: 'Triple Room', sqftTriple }
            }
            const hotelDetails = {
                amenitiesList: amenitiesList,
                hotelName: eachHotelDetail.hotelName,
                hotelNumber: eachHotelDetail.hotelNumber,
                location: location,
                roomsList:roomsList,
                availableStatus:product.availableStatus
            }
            const data = {
                personalDetails: personalDetails,
                hotelDetails: hotelDetails
            }
           
            registerHotel(data).then(res => {
                console.log(res.data)
                const data1 = res.data.userDataStore
                const data2 = res.data.hotelDatastore
                console.log(data1)
                _products.unshift({ ...data1 });
                _hotelDatas.unshift({ ...data2 });
               
                sethotelDatas(_hotelDatas)
                setProducts(_products)
                setEachHotelDetail(emptyData)
                setProduct(emptyProduct);
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000, });
        }
        else {
            const personalDetails = {
                name: product.name,
                email: product.email,
                availableStatus: product.availableStatus,
                mobileNo: product.mobileNo,
                gender: product.gender,
                hotelId:product.hotelId
            }
            function check(a,b){
                console.log(a)
             if(a===null) {
                return b
             } 
             return a
            }



            const roomsList = {
                deluxeRooms: { rooms:check(deluxeRooms,eachHotelDetail.roomsList.deluxeRooms.rooms ), price:  check(pricePerDayDeluxe,eachHotelDetail.roomsList.deluxeRooms.price ), adult:   check(adultDeluxe,eachHotelDetail.roomsList.deluxeRooms.adult ), child:   check(childDeluxe,eachHotelDetail.roomsList.deluxeRooms.child ), type: 'Deluxe Room', sqftDeluxe: check(sqftDeluxe,eachHotelDetail.roomsList.deluxeRooms.sqftDeluxe ) },
                nonDeluxeRooms: { rooms: check(nonDeluxeRooms,eachHotelDetail.roomsList.nonDeluxeRooms.rooms ), price:   check(pricePerDayNonDeluxe,eachHotelDetail.roomsList.nonDeluxeRooms.price ), adult:   check(adultNonDeluxe,eachHotelDetail.roomsList.nonDeluxeRooms.adult ), child:   check(childNonDeluxe,eachHotelDetail.roomsList.nonDeluxeRooms.child ), type: 'Non-Deluxe Room', sqftNonDeluxe: check(sqftNonDeluxe,eachHotelDetail.roomsList.nonDeluxeRooms.sqftNonDeluxe ) },
                suiteRooms: { rooms: check(suiteRooms,eachHotelDetail.roomsList.suiteRooms.rooms ), price:  check(pricePerDaySuite,eachHotelDetail.roomsList.suiteRooms.price ), adult:  check(adultSuite,eachHotelDetail.roomsList.suiteRooms.adultSuite ), child:  check(childSuite,eachHotelDetail.roomsList.suiteRooms.child ), type: 'Suite Room', sqftSuite:check(sqftSuite,eachHotelDetail.roomsList.suiteRooms.sqftSuite ) },
                familyRooms: { rooms: check(familyRooms,eachHotelDetail.roomsList.familyRooms.rooms ), price:  check(pricePerDayFamily,eachHotelDetail.roomsList.familyRooms.price ), adult:   check(adultFamily,eachHotelDetail.roomsList.familyRooms.adult ), child:   check(childFamily,eachHotelDetail.roomsList.familyRooms.child ) , type: 'Family Room', sqftFamily:check(sqftFamily,eachHotelDetail.roomsList.familyRooms.sqftFamily )},
                tripleRooms: { rooms: check(deluxeRooms,eachHotelDetail.roomsList.tripleRooms.rooms ), price:   check(pricePerDayTriple,eachHotelDetail.roomsList.tripleRooms.price ), adult :  check(adultTriple,eachHotelDetail.roomsList.tripleRooms.adult ), child:  check(childTriple,eachHotelDetail.roomsList.tripleRooms.child ), type: 'Triple Room', sqftTriple:check(sqftTriple,eachHotelDetail.roomsList.tripleRooms.sqftTriple ) }
            }
            const hotelDetails = {
                amenitiesList:  check(amenitiesList, eachHotelDetail.amenitiesList),
                hotelName: eachHotelDetail.hotelName,
                hotelNumber: eachHotelDetail.hotelNumber,
                location: check(location, eachHotelDetail.location),
                roomsList:roomsList,
                availableStatus:product.availableStatus,
                hotelId:product.hotelId
            }
            const data = {
                personalDetails: personalDetails,
                hotelDetails: hotelDetails
            }
            console.log(data)
            updateHotelDetails(data).then(res => {
                const index = findIndexByIdCab(eachHotelDetail.driverId)
                _hotelDatas[index] = eachHotelDetail
               
                sethotelDatas(_hotelDatas)
                setProducts(_products)
                setEachHotelDetail(emptyData)
                setProduct(emptyProduct);

            }).catch(err => {
                console.log(err)
            })
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        setProductDialog(false);
        setFromLocationList([])
        setToLocationList([])
    }
    
    const editProduct = (id) => {
        const data = products.filter(each => (
            each.hotelId === id
        ))
        const hData = hotelDatas.filter(each => (
            each.hotelId === id
        ))
      
        setamenitiesList(hData[0].amenitiesList)
        setLocation(hData[0].location)
        setProduct(...data);
        setEachHotelDetail(...hData);
        setProductDialog(true);
    }
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }
    const deleteProduct = () => {
        deleteHotel(product.hotelId).then(res => {
            let _products = products.filter(val => val._id !== product._id);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })
    }
    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].driverId === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    const findIndexByIdCab = (id) => {
        let index = -1;
        for (let i = 0; i < hotelDatas.length; i++) {
            if (hotelDatas[i].driverId === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    const importCSV = (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const data = csv.split('\n');
            // Prepare DataTable
            const cols = data[0].replace(/['"]+/g, '').split(',');
            data.shift();
            const importedData = data.map(d => {
                d = d.split(',');
                const processedData = cols.reduce((obj, c, i) => {
                    c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
                    obj[c] = d[i].replace(/['"]+/g, '');
                    (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
                    return obj;
                }, {});
                processedData['id'] = createId();
                return processedData;
            });
            const _products = [...products, ...importedData];
            setProducts(_products);
        };
        reader.readAsText(file, 'UTF-8');
    }
    const exportCSV = () => {
        dt.current.exportCSV();
    }
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }
    const deleteSelectedProducts = () => {
        const data = {
            id: "asdf",
        }
        const ids = selectedProducts.map(each => {
            var data = { "_id": each._id }
            return data
        })
        DeleteMultipleUserApi(ids).then(res => {
            console.log('deleted multiple')
        })
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product['availableStatus'] = e.value;
        setProduct(_product);
    }
    const onGenderChange = (e) => {
        let _product = { ...product };
        _product['gender'] = e.value;
        setProduct(_product);
    }
    const onInputChange = (e, username) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        let _data = { ...eachHotelDetail }
        if (_product[username] === undefined) {
            _data[username] = val
        } else {
            _product[username] = val;
        }
        if (username === "type") {
            if (val === 'Ac') {
                setShowAcCharges(true)
            } else {
                setShowAcCharges(false)
            }
        }
        setEachHotelDetail(_data)
        setProduct(_product);
    }
    const onInputNumberChange = (e, name) => {
        let _product = { ...product };
        let _data = { ...eachHotelDetail }
        const val = e.value || 0;
        if (_product[name] === undefined) {
            _data[name] = val
        } else {
            _product[name] = val;
        }
        setEachHotelDetail(_data)
        setProduct(_product);
    }
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                
            </React.Fragment>
        )
    }
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment  >
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }
    const statusBodyTemplate = (rowData) => {
        return <span className={`product-badge status-${rowData.availableStatus}`}>{rowData.availableStatus}</span>;
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData.hotelId)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }
    const header = (
        <div className="table-header dark-bg">
            <h5 className="mx-0 my-1">Manage Users</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText className='dark-bg' type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    function removeFrom(index) {
        setamenitiesList(amenitiesList.filter((el, i) => i !== index))
    }
    const toValue = async (data) => {
        setLocation(data)
        const request = await axios.get('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?sourceCountry=IN&SingleLine=' + data + '&+category=&outFields=*&forStorage=false&f=pjson')
        setshow_to_address(true);
      
        setACtolocation(request.data.candidates)
    }
    const getTolocation = (data) => {
       
        setLocation(data.address)
        setshow_to_address(false);
    }
    function removeTo(index) {
        setToLocationList(toLocationList.filter((el, i) => i !== index))
    }
    function fromLocationTags() {
        return product.cabData.fromLocationList
    }
   
    return (
        <Context.Consumer>
            {value => {
                const { sidebar } = value
                return (
                    loads &&
                    <div className="datatable-cab-crud-demo" data-testid="HotelUserTable">
                        <div className={`cards ${sidebar ? 'sidebar-table' : ''}`}>
                            <Toolbar className="mb-4 dark-bg " left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                            <Toast ref={toast} />
                            <DataTable className="dark-bg" ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                                dataKey="_id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Hotel User"
                                globalFilter={globalFilter} header={header} responsiveLayout="scroll" >
                               
                                <Column className="dark-bg" field="hotelId" header="Hotel Id" sortable style={{ minWidth: '12rem' }}></Column>
                                {/* //<Column field="createdAt" header="Date Created" sortable style={{ minWidth: '12rem' }}></Column> */}
                                <Column className="dark-bg" field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                                <Column className="dark-bg" field="email" header="Email" sortable style={{ minWidth: '10rem' }}></Column>
                                <Column className="dark-bg" field="availableStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }} ></Column>
                                <Column className="dark-bg" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                            </DataTable>
                        </div>
                        <Dialog visible={productDialog} style={{ width: '450px' }} header="Cab User Details" modal className="p-fluid dark-bg" footer={productDialogFooter} onHide={hideDialog}>
                            <div className="field ">
                                <label htmlFor="username">Name</label>
                                <InputText id="username" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus style={{ height: '40px' }} className={classNames({ 'p-invalid': submitted && !product.name })} />
                                {submitted && !product.name && <small className="p-error">Name is required.</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText id="email" style={{ height: '40px' }} value={product.email} onChange={(e) => onInputChange(e, 'email')} required />
                            </div>
                            <div className="field">
                                <label htmlFor="mobileNo">Mobile Number</label>
                                <InputText id="mobileNo" style={{ height: '40px' }} value={product.mobileNo} onChange={(e) => onInputChange(e, 'mobileNo')} required />
                            </div>
                            <div className="row">
                                <div className="row">
                                    <label htmlFor='status' className='col-4 mt-2'>Status</label>
                                    <div className="field-radiobutton col-4 mt-2">
                                        <RadioButton className='mb-1' inputId="category1" name="status" value="active" onChange={onCategoryChange} checked={product.availableStatus === 'active'} />
                                        <label className='mb-1 ml-2' htmlFor="category1">Active</label>
                                    </div>
                                    <div className="field-radiobutton col-4 mt-2">
                                        <RadioButton className='mb-1' inputId="category2" name="status" value="inactive" onChange={onCategoryChange} checked={product.availableStatus === 'inactive'} />
                                        <label className='mb-1 ml-2' htmlFor="category2">In Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="row">
                                    <label htmlFor='gender' className='col-4 mt-2'>Gender</label>
                                    <div className="field-radiobutton col-4 mt-2">
                                        <RadioButton className='mb-1' inputId="category1" name="gender" value="male" onChange={onGenderChange} checked={product.gender === 'male'} />
                                        <label className='mb-1 ml-2' htmlFor="category1">Male</label>
                                    </div>
                                    <div className="field-radiobutton col-4 mt-2">
                                        <RadioButton className='mb-1' inputId="category2" name="gender" value="female" onChange={onGenderChange} checked={product.gender === 'female'} />
                                        <label className='mb-1 ml-2' htmlFor="category2">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="hotelName">Hotel Name</label>
                                <InputText style={{ height: '40px' }} value={eachHotelDetail.hotelName} onChange={(e) => onInputChange(e, 'hotelName')} required />
                            </div>
                            <div className="field">
                                <label htmlFor="hotelName" className='mt-1'>Hotel No</label>
                                <InputText style={{ height: '40px' }} value={eachHotelDetail.hotelNumber} onChange={(e) => onInputChange(e, 'hotelNumber')} required />
                            </div>
                            <div className="field">
                                <label htmlFor="pickupLocation" className='mt-1' >Select amenities</label>
                                {amenitiesList.map((tag, index) => (
                                    <div className="tag-item" key={index}>
                                        <span className="text">{tag}</span>
                                        <span className="close" style={{ cursor: "pointer" }} onClick={() => removeFrom(index)}>&times;</span>
                                    </div>
                                ))}
                                <div className="formGrid">
                                    <InputText type="text" className="form-control" autoComplete="off" placeholder="Select Amenities" name='fromlocation' value={amenities} onClick={() => setshow_from_address(true)} />
                                    {show_from_address === true &&
                                        <>
                                            <div className='card py-2 my-height position-relative z-3'>
                                                <ul className='list-unstyled  text-sm-start  mb-0'>
                                                    <span className="close m-2" style={{ cursor: "pointer" }} onClick={() => setshow_from_address(false)}>&times;</span>
                                                    {amenitiesData.map((data, index) => (
                                                        <li type='button' className='px-1 py-1 fs-6 select' key={index} onClick={() => { getFromlocation(data) }}>{data}</li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="filed">
                                <label className='mt-1' htmlFor="toLocations ">Location</label>
                                <div className="formGrid ">
                                    <InputText type="text" className="form-control" autoComplete="off" placeholder="Location" name='Tolocation' value={location} onChange={(event) => toValue(event.target.value)} />
                                    {show_to_address === true ? ACtolocation.length !== 0 ?
                                        <>
                                            <div className='card py-2 my-height position-relative z-3'>
                                                <ul className='list-unstyled mb-0'>
                                                    {ACtolocation.map((data, index) => (
                                                        <li type='button' className='px-2 py-1 fs-6 select' key={index} onClick={() => { getTolocation(data) }}>{data.address}</li>
                                                    ))
                                                    }
                                                </ul>
                                            </div>
                                        </> : <>
                                            <div className='card py-2 w-100 position-relative z-3'>
                                                <p className='fs-6 mb-0'>
                                                    Not Founded
                                                </p>
                                            </div>
                                        </> : <></>
                                    }
                                </div>
                            </div>
                            {/* <div className="field">
                            <label  htmlFor="priceKm" >Price Per Km</label>
                            <div className="formGrid">
                              <InputNumber style={{height:'40px'}} value={eachHotelDetail.pricePerKm} placeholder='In Rupees' onChange={(e) => onInputNumberChange(e, 'pricePerKm')} />
                            </div>
                          </div> */}
                            {/* Rooms Types */}
                            <div className="field">
                                <label htmlFor="hotelName" className='mt-1'>Rooms Types</label>
                                <div className="field">
                                    <h5 className='text-center mb-3 mt-2'>Deluxe Rooms</h5>
                                    <div className='col-12'>
                                        <label htmlFor="hotelName " className='mt-1 col-6'>No Of Rooms</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.deluxeRooms?.rooms} onChange={(e) => setDeluxeRooms(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Adults</label>
                                        <InputNumber className='mb-2 col-6' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.deluxeRooms?.adult} onChange={(e) => setAdultDeluxe(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Child</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.deluxeRooms?.child} onChange={(e) => setChildDeluxe(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Sqft</label>
                                        <InputText className='col-5 ms-3 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.deluxeRooms?.sqftDeluxe} onChange={(e) => setSqftDeluxe(e.target.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>Price Per Night in Rs</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.deluxeRooms?.price} onChange={(e) => setPricePerDayDeluxe(e.value)} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <h5 className='text-center mb-3 mt-2'>Non-Deluxe Rooms</h5>
                                    <div className='col-12'>
                                        <label htmlFor="hotelName " className='mt-1 col-6'>No Of Rooms</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.nonDeluxeRooms?.rooms} onChange={(e) => setNonDeluxeRooms(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Adults</label>
                                        <InputNumber className='mb-2 col-6' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.nonDeluxeRooms?.adult} onChange={(e) => setAdultNonDeluxe(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Child</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.nonDeluxeRooms?.child} onChange={(e) => setChildNonDeluxe(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Sqft</label>
                                        <InputText className='col-5 ms-3 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.nonDeluxeRooms?.sqftNonDeluxe} onChange={(e) => setSqftNonDeluxe(e.target.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>Price Per Night in Rs</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.nonDeluxeRooms?.price} onChange={(e) => setPricePerDayNonDeluxe(e.value)} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <h5 className='text-center mb-3 mt-2'>Suite Rooms</h5>
                                    <div className='col-12'>
                                        <label htmlFor="hotelName " className='mt-1 col-6'>No Of Rooms</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.suiteRooms?.rooms} onChange={(e) => setSuiteRooms(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Adults</label>
                                        <InputNumber className='mb-2 col-6' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.suiteRooms?.adult} onChange={(e) => setAdultSuite(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Child</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.suiteRooms?.child} onChange={(e) => setChildSuite(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Sqft</label>
                                        <InputText className='col-5 ms-3 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.suiteRooms?.sqftSuite} onChange={(e) => setSqftSuite(e.target.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>Price Per Night in Rs</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.suiteRooms?.price} onChange={(e) => setPricePerDaySuite(e.value)} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <h5 className='text-center mb-3 mt-2'>Family Rooms</h5>
                                    <div className='col-12'>
                                        <label htmlFor="hotelName " className='mt-1 col-6'>No Of Rooms</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.familyRooms?.rooms} onChange={(e) => setFamilyRooms(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Adults</label>
                                        <InputNumber className='mb-2 col-6' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.familyRooms?.adult} onChange={(e) => setAdultFamily(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Child</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.familyRooms?.child} onChange={(e) => setChildFamily(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Sqft</label>
                                        <InputText className='col-5 ms-3 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.familyRooms?.sqftFamily} onChange={(e) => setSqftFamily(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>Price Per Night in Rs</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.familyRooms?.price} onChange={(e) => setPricePerDayFamily(e.value)} required />
                                    </div>
                                </div>
                                <div className="field">
                                    <h5 className='text-center mb-3 mt-2'>Triple Rooms</h5>
                                    <div className='col-12'>
                                        <label htmlFor="hotelName " className='mt-1 col-6'>No Of Rooms</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.tripleRooms?.rooms} onChange={(e) => setTripleRooms(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Adults</label>
                                        <InputNumber className='mb-2 col-6' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.tripleRooms?.adult} onChange={(e) => setAdultTriple(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Child</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.tripleRooms?.child} onChange={(e) => setChildTriple(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>No Of Sqft</label>
                                        <InputText className='col-5 ms-3 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.tripleRooms?.sqftTriple} onChange={(e) => setSqftTriple(e.value)} required />
                                        <label htmlFor="hotelName" className='mt-1 col-6'>Price Per Night in Rs</label>
                                        <InputNumber className='col-6 mb-2 ' style={{ height: '40px' }} value={eachHotelDetail.roomsList?.tripleRooms?.price} onChange={(e) => setPricePerDayTriple(e.value)} required />
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                        <Dialog dark-bg visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                            </div>
                        </Dialog>
                        <Dialog dark-bg visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {product && <span>Are you sure you want to delete the selected products?</span>}
                            </div>
                        </Dialog>
                    </div>
                )
            }}
        </Context.Consumer>
    );
}
HotelUserTable.propTypes = {};
HotelUserTable.defaultProps = {};
export default HotelUserTable;
